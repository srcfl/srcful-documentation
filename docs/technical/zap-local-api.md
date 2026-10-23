---
sidebar_position: 6
sidebar_label: Zap Local API
slug: /technical/zap-local-api
---

# Zap Local API

Complete endpoint documentation for the controller firmware.

> **Firmware version:** This page documents Zap firmware **v2.3.27**. Newer firmware may add, change or remove endpoints. Check `zap.firmwareVersion` in [GET /api/system](#get-apisystem).

> **No authentication:** The local API does not require authentication. Anyone who can reach the Zap on the local network can call every endpoint, including those that change the MQTT broker, WiFi credentials or devices. Keep the Zap on a trusted network. The same endpoints are also reachable over BLE during onboarding and through the cloud request/response channel over MQTT.

## Table of Contents

1. [Discovery (mDNS)](#discovery-mdns)
2. [System & Network](#system--network)
   - [System Info](#get-apisystem)
   - [System Reboot](#post-apisystemreboot)
   - [Factory Reset](#post-apisystemfactory-reset)
   - [Log Stream](#post-apisystemlog_stream)
   - [Network Status](#get-apinetwork)
   - [WiFi Status](#get-apiwifi)
   - [WiFi Config](#post-apiwifi)
   - [WiFi Reset](#delete-apiwifi)
   - [WiFi Scan](#get-apiwifiscan)
   - [BLE Stop](#post-apiblestop)
   - [MQTT Config (GET)](#get-apisystemmqtt)
   - [MQTT Config (POST)](#post-apisystemmqtt)
   - [MQTT Config (DELETE)](#delete-apisystemmqtt)
   - [Backend (GET)](#get-apisystembackend)
   - [Backend (POST)](#post-apisystembackend)
3. [Device Management](#device-management)
   - [Supported Devices](#get-apidevicessupported)
   - [Connection Types](#get-apidevicestypes)
   - [List Devices](#get-apidevices)
   - [Add Device](#post-apidevices)
   - [Get Device](#get-apidevicessn)
   - [Update Device](#put-apidevicessn)
   - [Remove Device](#delete-apidevicessn)
   - [Remove All Devices](#delete-apidevices)
   - [Device Data (JSON)](#get-apidevicessndatajson)
   - [Device Data (Raw)](#get-apidevicessndataraw)
   - [Device Data (Debug)](#get-apidevicessndatadebug)
   - [Update DER Types](#post-apidevicessntypes)
   - [Get DER Metadata](#get-apidevicessnders)
   - [Update DER Metadata](#post-apidevicessnders)
   - [Read Registers](#get-apidevicessnregistersaddress)
   - [Write Registers](#post-apidevicessnregisters)
4. [Control & Operations](#control--operations)
   - [Init Control](#post-apicontrolsninit)
   - [Battery Control](#post-apicontrolsnbattery)
   - [PV Curtailment](#post-apicontrolsncurtail)
   - [Disable Curtailment](#post-apicontrolsncurtaildisable)
   - [Deinit Control](#post-apicontrolsndeinit)
5. [Diagnostics](#diagnostics)
   - [Port Check](#post-apinetworkport-check)
   - [Network Scan](#post-apinetworkscan)
   - [Modbus Read](#post-apimodbusread)
6. [Identity & Security](#identity--security)
   - [Crypto Info](#get-apicrypto)
   - [Sign Message](#post-apicryptosign)
   - [Device Name](#get-apiname)
7. [Utilities](#utilities)
   - [Debug Info](#get-apidebug)
   - [Echo](#post-apiecho)
8. [Reference](#reference)
   - [Status Codes](#status-codes)
   - [Examples](#examples)
   - [Notes](#notes)

---

## Base URL

All endpoints prefixed with `/api/`.

Examples:
- `http://192.168.1.100/api/system` (IP address)
- `http://zap-0000a1b2c3d4e5f6.local/api/system` (device-unique mDNS name)
- `http://zap.local/api/system` (alias, only on the first Zap on the network, see below)

The server listens on plain HTTP, port 80.

---

## Discovery (mDNS)

Once connected to a network, the Zap announces itself over mDNS:

| What | Value |
| --- | --- |
| Primary hostname | `<device id>.local`, e.g. `zap-0000a1b2c3d4e5f6.local`. The device ID is `zap-0000` followed by the WiFi STA MAC address in reverse byte order, lowercase hex. It is the same value as `zap.deviceId` in `GET /api/system` and `name` in `GET /api/name`. |
| Alias | `zap.local`. The Zap claims it only if no other device answers to `zap.local` within 2 seconds. With several Zaps on one network, only the first one gets it, so use the device-unique name when you can. |
| Service | `_http._tcp`, port 80, instance name = device ID |
| TXT records | `id` (device ID), `ver` (firmware version), `mac` (WiFi MAC, `AA:BB:CC:DD:EE:FF`) |
| DHCP hostname | Same as the device ID, so the Zap also shows up under that name in most routers. |

mDNS starts once the network is up **and** the BLE onboarding service has stopped. On WiFi this is normally about 60 seconds after the Zap connects. On Ethernet it does not wait for BLE. Until then, use the IP address.

Example discovery:
```bash
# Linux (Avahi)
avahi-browse -rt _http._tcp | grep -A3 zap-
# macOS
dns-sd -B _http._tcp
```

---

## System & Network

### GET /api/system

System info, memory, network status, uptime and active backend.

**Response** (200):
```json
{
  "timeUtcSec": 1697515200,
  "uptimeSeconds": 123456,
  "temperatureCelsius": 41.5,
  "backend": "mainnet",
  "memoryKb": {
    "total": 300.2,
    "free": 120.5,
    "used": 179.7,
    "percentUsed": 59.9,
    "min": 80.1,
    "largest": 60.0
  },
  "processesAverage": {
    "last1min": 0,
    "last5min": 0,
    "last15min": 0
  },
  "logging": {
    "enabled": false,
    "level": 4
  },
  "zap": {
    "deviceId": "zap-0000a1b2c3d4e5f6",
    "platform": "zap",
    "cpuFreqMHz": 160,
    "flashSizeMB": 0.0,
    "sdkVersion": "v5.x",
    "firmwareVersion": "2.3.27",
    "publicKey": "<128 hex chars>",
    "network": {
      "wifiMac": "AA:BB:CC:DD:EE:FF",
      "wifiStatus": "connected",
      "wifiConnected": true,
      "localIP": "192.168.1.100",
      "ssid": "MyNetwork",
      "rssi": -45,
      "interfaces": {
        "wifi": {
          "mac": "AA:BB:CC:DD:EE:FF",
          "connected": true,
          "ip": "192.168.1.100",
          "ssid": "MyNetwork",
          "rssi": -45
        }
      },
      "internetConnected": true,
      "mqttConnected": true
    }
  }
}
```

- `backend`: active backend network (`mainnet`, `testnet` or `devnet`), see [GET /api/system/backend](#get-apisystembackend).
- `temperatureCelsius`: SoC temperature, `0.0` if the chip has no sensor.
- `publicKey`: the device's P-256 public key as 128 hex characters (X‖Y, no `04` prefix).
- `flashSizeMB` is always `0.0` in v2.3.27. `processesAverage` is a placeholder (always zero).
- `platform`: board name. The value depends on the hardware.
- On boards with Ethernet, the `network` object also contains `ethMac`, `ethStatus`, `ethConnected`, `ethAvailable`, `ethLocalIP` (when connected) and `interfaces.eth` (`mac`, `connected`, `available`, `ip`).
- When WiFi is disconnected, `wifiStatus` is `"disconnected"`, `wifiConnected` is `false`, and `localIP`, `ssid`, `rssi` are left out.

### POST /api/system/reboot

Reboot device after 5s delay.

**Response** (200):
```json
{
  "status": "success",
  "message": "System is rebooting in 5 seconds"
}
```

### POST /api/system/factory-reset

Factory reset the device. Clears all device configurations, MQTT configuration, and WiFi credentials, then reboots.

**Response** (200):
```json
{
  "message": "Factory reset successful. Rebooting in 2 seconds."
}
```

**Errors**:
- 500 - Reset operation failed

### POST /api/system/log_stream

Toggle real-time log streaming to MQTT. When enabled, device logs are published to `gateways/{gateway_id}/logs/raw`.

**Request**:
```json
{
  "enabled": true,
  "level": 4
}
```
*Note: `level` is optional (default: 4/INFO). Levels: 1=ERROR, 2=WARN, 3=OK, 4=INFO, 5=DEBUG, 6=VERBOSE.*

**Response** (200):
```json
{
  "enabled": true,
  "status": "ok"
}
```

### GET /api/network

Network connectivity status. Returns the same object as `zap.network` in [GET /api/system](#get-apisystem) (WiFi fields, Ethernet fields on Ethernet boards, `interfaces`, `internetConnected`, `mqttConnected`).

**Response** (200):
```json
{
  "wifiMac": "AA:BB:CC:DD:EE:FF",
  "wifiStatus": "connected",
  "wifiConnected": true,
  "localIP": "192.168.1.100",
  "ssid": "MyNetwork",
  "rssi": -45,
  "interfaces": {
    "wifi": { "mac": "AA:BB:CC:DD:EE:FF", "connected": true, "ip": "192.168.1.100", "ssid": "MyNetwork", "rssi": -45 }
  },
  "internetConnected": true,
  "mqttConnected": true
}
```

### GET /api/wifi

Get WiFi status and scan results.

**Response** (200):
```json
{
  "ssids": ["Network1", "Network2"],
  "connected": "Network1"
}
```
*Note: `connected` is null if not connected.*

### POST /api/wifi

Set WiFi credentials and connect.

**Request**:
```json
{
  "ssid": "MyNetwork",
  "psk": "mypassword"
}
```

**Response** (200):
```json
{
  "status": "success",
  "message": "WiFi credentials updated and connected"
}
```

**Errors**:
- 400 - Missing `ssid` or `psk`
- 500 - WiFi connect failed

### DELETE /api/wifi

Clear WiFi credentials and disconnect.

**Response** (200):
```json
{
  "status": "success",
  "message": "WiFi credentials cleared, disconnecting in 5 seconds"
}
```

### GET /api/wifi/scan

Initiate a WiFi scan. Results will be available in `GET /api/wifi`.

**Response** (200):
```json
{
  "status": "sucess",
  "message": "scan initiated"
}
```

### POST /api/ble/stop

Stop the BLE service.

**Response** (200):
```json
{
  "status": "success",
  "message": "BLE stopping..."
}
```

### GET /api/system/mqtt

Get the stored MQTT broker configuration.

**Response** (200):
```json
{
  "mqtt_connection_str": "mqtts://broker.example.com:8883",
  "mqtt_connection_fallback_str": ""
}
```
Both fields are empty strings when no custom broker is set. In that case the Zap connects to the default broker of the active [backend](#get-apisystembackend) (`mqtts://novacore-mainnet.sourceful.dev` by default).

### POST /api/system/mqtt

Point the Zap at a custom MQTT broker. The new settings take effect after a reboot, which the Zap schedules itself about 2 seconds after it responds.

**Request**:
```json
{
  "mqtt_connection_str": "mqtts://broker.example.com:8883",
  "mqtt_connection_fallback_str": "mqtts://fallback.example.com:8883"
}
```
At least one of `mqtt_connection_str` or `mqtt_connection_fallback_str` is required. A field that is left out keeps its current value. Each value can be at most 255 characters.

**Response** (200):
```json
{
  "status": "success",
  "message": "MQTT config updated, reboot scheduled"
}
```

**Errors**:
- 400 - Empty body or missing both connection strings

**Behaviour**:
- **URL format:** `mqtts://host[:port]` (TLS) or `mqtt://host[:port]` (plain). The default port is 8883 for `mqtts` and 1883 for `mqtt`. The Zap uses MQTT 3.1.1.
- **TLS:** for hosts under `sourceful.dev` or `srcful.dev`, the server certificate is checked against the pinned Let's Encrypt root. For **any other host, certificate verification is turned off** (the connection is encrypted but the server is not verified).
- **Fallback:** if a fallback is set and the primary broker cannot be reached, the Zap **overwrites the primary with the fallback**, saves it and reboots. It does not switch back by itself.
- **Backend is unchanged:** this endpoint only changes the MQTT broker. OTA update checks and device self-registration still use the active backend (see [POST /api/system/backend](#post-apisystembackend)).
- **Storage:** the settings are saved in `/spiffs/system_config.json` and kept across reboots and firmware updates. A [factory reset](#post-apisystemfactory-reset) clears them.

### DELETE /api/system/mqtt

Remove the custom broker configuration (both strings). After the reboot the Zap connects to the default broker of the active backend. Reboots about 2 seconds after responding.

**Response** (200):
```json
{
  "status": "success",
  "message": "MQTT config removed from NVS, reboot scheduled"
}
```
The settings are stored in SPIFFS, not NVS; the message text is historical.

### GET /api/system/backend

Get the active backend network.

**Response** (200):
```json
{ "backend": "mainnet" }
```
One of `mainnet`, `testnet`, `devnet`. Defaults to `mainnet` when nothing has been selected.

### POST /api/system/backend

Switch the Zap to another Sourceful backend network. This sets the backend used for OTA and self-registration **and** replaces the MQTT broker with that network's default broker, then reboots about 2 seconds after responding. The fallback broker string is not changed.

**Request**:
```json
{ "backend": "testnet" }
```

| `backend` | MQTT broker |
| --- | --- |
| `mainnet` | `mqtts://novacore-mainnet.sourceful.dev` |
| `testnet` | `mqtts://novacore-testnet.sourceful.dev` |
| `devnet` | `mqtts://novacore-devnet.sourceful.dev` |

**Response** (200):
```json
{
  "status": "success",
  "backend": "testnet",
  "message": "Network switched, reboot scheduled"
}
```

**Errors**:
- 400 - Empty body, missing `backend`, or a value other than `devnet`, `testnet`, `mainnet`

---

## Device Management

### GET /api/devices/supported

List supported device profiles.

**Response** (200):
```json
{
  "count": 12,
  "batteries": [],
  "ev_chargers": [],
  "energy_meters": [
    {
      "display_name": "P1 Meter",
      "profile": "p1_meter",
      "device_type": "energy_meter",
      "connection_types": ["p1_uart"]
    },
    {
      "display_name": "Fronius Smart Meter",
      "profile": "fronius_smart_meter",
      "device_type": "energy_meter",
      "connection_types": ["modbus_tcp"]
    }
  ],
  "inverters": [
    {
      "display_name": "Sungrow",
      "profile": "sungrow",
      "device_type": "inverter",
      "connection_types": ["modbus_tcp", "modbus_rtu"]
    },
    {
      "display_name": "Solis",
      "profile": "solis",
      "device_type": "inverter",
      "connection_types": ["modbus_tcp", "modbus_rtu"]
    }
  ],
  "v2x_chargers": [
    {
      "display_name": "Ambibox",
      "profile": "ambibox",
      "device_type": "v2x_charger",
      "connection_types": ["mqtt"]
    }
  ]
}
```

### GET /api/devices/types

List all connection types and the parameters needed to create a device. The response is an object keyed by connection type.

**Response** (200, shortened):
```json
{
  "connection_types": {
    "modbus_tcp": {
      "description": "Modbus TCP connection",
      "parameters": [
        { "name": "ip", "display_name": "IP Address", "type": "string", "required": true },
        { "name": "port", "display_name": "Port", "type": "integer", "required": true, "default": 502 },
        { "name": "unit_id", "display_name": "Unit ID", "type": "integer", "required": true, "default": 1 },
        { "name": "profile", "display_name": "Device Profile", "type": "string", "required": true }
      ]
    },
    "modbus_rtu": {
      "description": "Modbus RTU connection over RS485",
      "parameters": [
        { "name": "baud_rate", "type": "integer", "required": true, "default": 9600 },
        { "name": "unit_id", "type": "integer", "required": true, "default": 1 },
        { "name": "profile", "type": "string", "required": true },
        { "name": "parity", "type": "integer", "required": false, "default": 0, "description": "0=None, 1=Odd, 2=Even" },
        { "name": "data_bits", "type": "integer", "required": false, "default": 8 },
        { "name": "stop_bits", "type": "integer", "required": false, "default": 1 }
      ]
    },
    "p1_uart": {
      "description": "P1 Port (DSMR) connection",
      "parameters": [
        { "name": "manufacturer", "type": "string", "required": false },
        { "name": "baud_rate", "type": "integer", "required": true, "default": 115200 },
        { "name": "data_bits", "type": "integer", "required": true, "default": 8 },
        { "name": "parity", "type": "string", "required": false, "default": "none", "description": "none, even, odd" },
        { "name": "stop_bits", "type": "integer", "required": false, "default": 1 }
      ]
    },
    "han_uart": {
      "description": "HAN (Home Area Network) M-Bus connection",
      "parameters": [
        { "name": "manufacturer", "type": "string", "required": false }
      ]
    },
    "mqtt": {
      "description": "MQTT connection",
      "parameters": [
        { "name": "broker_host", "type": "string", "required": true },
        { "name": "broker_port", "type": "integer", "required": false, "default": 1883 },
        { "name": "username", "type": "string", "required": false },
        { "name": "password", "type": "string", "required": false },
        { "name": "client_id", "type": "string", "required": false }
      ]
    }
  }
}
```
Every parameter object also has a `display_name` (omitted above except for `modbus_tcp`).

### GET /api/devices

List all configured devices. Each entry is the persisted config augmented with runtime:
- `connected`: boolean – current connection state
- `last_harvest`: unix ms timestamp of most recent DER data (omitted if none yet)
- `path`: string – the path to the configuration file in SPIFFS (e.g. `spiffs/devices/6178e775.json`)
- `ders`: per-DER entries (pv/battery/meter/v2x_charger) with publish flags; PV entries also expose `installed_power` (W) alongside persisted `rated_power` (W), and battery `capacity` (Wh)

**Response** (200):
```json
{
  "count": 2,
  "devices": [
    {
      "type": "modbus_tcp",
      "profile": "sungrow",
      "device_type": "inverter",
      "sn": "INV003SIM03",
      "ip": "192.168.1.60",
      "port": 502,
      "unit_id": 1,
      "connected": true,
      "last_harvest": 1761832393075,
      "path": "spiffs/devices/6178e775.json",
      "ders": [
        {
          "type": "pv",
          "enabled": false,
          "installed_power": 9500,
          "rated_power": 10000
        },
        {
          "type": "battery",
          "enabled": false,
          "rated_power": 5000,
          "capacity": 10000
        },
        {
          "type": "meter",
          "enabled": false
        }
      ]
    },
    {
      "type": "mqtt",
      "profile": "ambibox",
      "device_type": "v2x_charger",
      "sn": "ambibox_192.168.1.50",
      "broker_host": "192.168.1.50",
      "broker_port": 1883,
      "username": "user",
      "client_id": "esp32_local",
      "connected": false,
      "ders": [
        {
          "type": "v2x_charger",
          "enabled": false,
          "capacity": 0
        }
      ]
    }
  ]
}
```

### POST /api/devices

Add a device.

- **Modbus and MQTT devices:** the Zap connects and reads the device first. The config is saved only if that works.
- **P1 and HAN smart meters (`p1_uart`, `han_uart`):** the meter is saved right away, without waiting for data. Detection of the physical port and serial framing then runs in the background, so setup works even if the meter is not plugged in yet. A Zap holds at most one smart meter; repeating the request returns the existing meter (200). The meter DER starts with `enabled: false`, so nothing is published until it is enabled with [POST /api/devices/\{sn\}/types](#post-apidevicessntypes). The serial number is generated from the device ID: `p1m-…` for P1, `han-…` for HAN (e.g. `p1m-0000a1b2c3d4e5f6`).

**Modbus TCP**:
```json
{
  "type": "modbus_tcp",
  "ip": "192.168.1.60",
  "port": 502,
  "unit_id": 1,
  "profile": "sungrow"
}
```

**Modbus RTU** (RS-485):
```json
{
  "type": "modbus_rtu",
  "baud_rate": 9600,
  "unit_id": 1,
  "profile": "sungrow",
  "parity": 0
}
```
*Note: On ESP32-C3 (ZAP), Modbus RTU uses UART0 (TX=GPIO7, RX=GPIO5, RTS=GPIO6). P1 and RTU can run simultaneously.*

**P1 UART**:
```json
{
  "type": "p1_uart",
  "manufacturer": "MyMeter",
  "baud_rate": 115200,
  "data_bits": 8,
  "parity": "none",
  "stop_bits": 1
}
```

**HAN UART** (M-Bus):
```json
{
  "type": "han_uart"
}
```

**P1 UART Configuration Options**:
- `baud_rate`: Integer > 0 (e.g., 9600, 115200)
- `data_bits`: 5, 6, 7, 8
- `parity`: "none", "even", "odd"
- `stop_bits`: 1, 2, "1.5"

**MQTT** (Ferroamp EnergyHub):
```json
{
  "type": "mqtt",
  "profile": "ferroamp",
  "broker_host": "192.168.1.70",
  "broker_port": 1883,
  "username": "extapi",
  "password": "your_password"
}
```

**MQTT** (Ambibox EV Charger):
```json
{
  "type": "mqtt",
  "profile": "ambibox",
  "broker_host": "192.168.1.70",
  "broker_port": 1884,
  "username": "external-ems",
  "password": "your_password"
}
```

**Response** (201):
```json
{
  "message": "Device added and connected",
  "sn": "INV003SIM03",
  "ders": [
    {
      "type": "pv",
      "enabled": false,
      "rated_power": 10000
    },
    {
      "type": "battery",
      "enabled": false,
      "rated_power": 0,
      "capacity": 0
    },
    {
      "type": "meter",
      "enabled": false
    }
  ]
}
```

**Response for a P1/HAN smart meter** (201 when added, 200 when it already existed):
```json
{
  "message": "Smart meter added; automatic port detection started",
  "sn": "p1m-0000a1b2c3d4e5f6",
  "ders": [
    { "type": "meter", "enabled": false }
  ]
}
```
For an existing meter the message is `"Smart meter already added"`.

**Errors**:
- 400 - Invalid config
- 409 - Device exists or conflicts (UART/TCP endpoint)
- 503 - Connection failed or insufficient memory (requires >55KB free heap)

### GET `/api/devices/{sn}`

Get the stored configuration of one device: its connection parameters, `sn` and DER metadata, in the same shape as the entries in [GET /api/devices](#get-apidevices) but without the runtime fields (`connected`, `last_harvest`, `path`).

Example: `GET /api/devices/INV003SIM03`

**Errors**:
- 400 - Missing serial number
- 404 - Device not found

### PUT `/api/devices/{sn}`

Change the connection settings of an existing device, for example after its IP address changed. The body is a full device config, in the same format as [POST /api/devices](#post-apidevices). The Zap connects with the new settings and checks that the device reports the same serial number before it replaces the old config. If the body has a `ders` array it is applied (same format as [POST /api/devices/\{sn\}/ders](#post-apidevicessnders)); otherwise the existing DER settings are kept.

Example: `PUT /api/devices/INV003SIM03`

**Request**:
```json
{
  "type": "modbus_tcp",
  "ip": "192.168.1.61",
  "port": 502,
  "unit_id": 1,
  "profile": "sungrow"
}
```

**Response** (200):
```json
{ "message": "Device updated", "sn": "INV003SIM03" }
```

**Errors**:
- 400 - Missing serial number or invalid config
- 404 - Device not found
- 409 - Serial number mismatch (a different physical device answered). The body includes `expected_sn` and `actual_sn`.
- 500 - Failed to save the updated device
- 503 - Could not connect with the new config, or could not read the serial number

### DELETE `/api/devices/{sn}`

Remove device by serial number.

**Example**: `DELETE /api/devices/INV003SIM03`

**Response** (200):
```json
{ "message": "Device removed" }
```

**Errors**:
- 400 - Missing serial number
- 404 - Device not found

### DELETE /api/devices

Remove all devices. Clears runtime memory and deletes all device configurations from storage.

**Example**: `DELETE /api/devices`

**Response** (200):
```json
{ "message": "All devices removed" }
```

**Errors**:
- 500 - Failed to clear devices (e.g. SPIFFS error)

### GET `/api/devices/{sn}/data/json`

Latest device data snapshot in JSON format.

**Example**: `GET /api/devices/INV003SIM03/data/json`

**Response** (200):
```json
{
  "pv": {
    "type": "pv",
    "timestamp": 1761832393075,
    "read_time_ms": 472,
    "make": "sungrow",
    "W": -2500,
    "total_generation_Wh": 22698000
  },
  "battery": {
    "type": "battery",
    "timestamp": 1761832393075,
    "read_time_ms": 156,
    "make": "sungrow",
    "W": -500,
    "V": 48.2,
    "A": -10.4,
    "SoC_nom_fract": 0.85
  },
  "meter": { /* ... if present ... */ },
  "v2x_charger": {
    "type": "v2x_charger",
    "timestamp": 1761832393075,
    "read_time_ms": 0,
    "make": "ambibox",
    "status": "charging",
    "W": 7400,
    "A": 32.0,
    "V": 230.0,
    "Hz": 50.0,
    "L1_V": 230.0,
    "L1_A": 10.7,
    "L1_W": 2461.0,
    "L2_V": 229.5,
    "L2_A": 10.6,
    "L2_W": 2432.7,
    "L3_V": 230.2,
    "L3_A": 10.8,
    "L3_W": 2486.2,
    "dc_W": -7200,
    "dc_V": 400.0,
    "dc_A": -18.0,
    "vehicle_soc_fract": 0.45,
    "ev_min_energy_req_Wh": 5000,
    "ev_max_energy_req_Wh": 40000,
    "session_charge_Wh": 12500,
    "session_discharge_Wh": 0,
    "total_charge_Wh": 125000,
    "total_discharge_Wh": 45000,
    "lower_limit_W": [-11000, 0, 1400],
    "upper_limit_W": [-1400, 0, 11000],
    "capacity_Wh": 77000,
    "rated_power_W": 11000
  },
  "version": "v1",
  "format": "json"
}
```

**Errors**:
- 204 - No harvest data yet
- 404 - Device not found
- 503 - Device busy (lock timeout)

### GET `/api/devices/{sn}/data/raw`

Raw device data snapshot. For P1 meters, returns the raw OBIS strings as received from the meter. For other device types, returns device-specific raw data if available.

**Example**: `GET /api/devices/p1_meter/data/raw`

**Response** (200) - P1 Meter:
```json
{
  "format": "p1_uart",
  "data": {
    "ts": 1770302863728,
    "device_id": "p1_meter",
    "obis": [
      "1-3:0.2.8(50)",
      "0-0:1.0.0(251021091842S)",
      "1-0:1.8.1(004121.646*kWh)",
      "1-0:1.8.2(004416.112*kWh)",
      "1-0:2.8.1(002029.530*kWh)",
      "1-0:2.8.2(004760.021*kWh)",
      "1-0:1.7.0(00.000*kW)",
      "1-0:2.7.0(00.445*kW)",
      "1-0:32.7.0(238.1*V)",
      "1-0:52.7.0(236.6*V)",
      "1-0:72.7.0(237.9*V)"
    ]
  }
}
```

**Fields**:
- `format`: Device connection type (e.g., `p1_uart`, `modbus_tcp`)
- `data`: Raw payload object (format varies by device type)
  - P1 meters: `ts` (timestamp ms), `device_id`, `obis` (array of OBIS strings)

**Errors**:
- 204 - No raw data available yet
- 404 - Device not found
- 503 - Device busy

### GET `/api/devices/{sn}/data/debug`

Debug information for troubleshooting device communication issues. For P1 meters, returns the hex dump and ASCII representation of the last frame that failed to decode.

**Example**: `GET /api/devices/p1_meter/data/debug`

**Response** (200) - P1 Meter with failed frame:
```json
{
  "device_type": "p1_uart",
  "sn": "p1_meter",
  "last_failed_ts": 1770302863728,
  "last_failed_type": 0,
  "last_failed_size": 56,
  "last_failed_hex": "2F 58 4D 58 35 4C 47 42 42 46 46 46 46 31 30 30 31 32 33 34 35 36 37 38 ...",
  "last_failed_ascii": "/XMX5LGBBFFFF10012345678..."
}
```

**Response** (200) - P1 Meter with no failed frames:
```json
{
  "device_type": "p1_uart",
  "sn": "p1_meter",
  "last_failed_hex": "",
  "message": "No failed frames recorded yet"
}
```

**Response** (200) - Non-P1 device:
```json
{
  "sn": "INV003SIM03",
  "message": "Debug info not available for this device type"
}
```

**Fields**:
- `device_type`: Device connection type
- `last_failed_ts`: Timestamp (ms) when the frame was received
- `last_failed_type`: Frame type (0=ASCII, 1=HDLC, 2=MBUS)
- `last_failed_size`: Size of the failed frame in bytes
- `last_failed_hex`: Hex dump of frame bytes (up to 256 bytes)
- `last_failed_ascii`: ASCII representation (non-printable chars replaced with '.')

*Note: Failed frames are also logged to the MQTT log stream with the first 64 bytes in hex format.*

**Errors**:
- 404 - Device not found

### POST `/api/devices/{sn}/types`

Enable/disable publishing for detected DERs on a device. Only included DERs in the request are modified. Omitted entries remain unchanged.

By default, all detected DERs have `enabled = false` on first connection.

**Request**:
```json
{
  "ders": [
    { "type": "pv", "enabled": true },
    { "type": "battery", "enabled": false }
  ]
}
```

**Response** (200):
```json
{ "message": "Types updated", "sn": "INV003SIM03" }
```
If nothing changed, the response is 200 with `"message": "No changes"`.

**Errors**:
- 400 - Missing ders array
- 404 - Device not found
- 500 - Failed to persist config

### GET `/api/devices/{sn}/ders`

Fetch publish state plus configured DER metadata. The fields returned are the user-configurable fields that can be updated via POST.

**Response** (200):
```json
{
  "sn": "INV003SIM03",
  "ders": [
    {
      "type": "pv",
      "enabled": true,
      "rated_power": 10000,
      "installed_power": 8500
    },
    {
      "type": "battery",
      "enabled": false,
      "rated_power": 4800,
      "capacity": 9600
    },
    {
      "type": "meter",
      "enabled": false
    },
    {
      "type": "v2x_charger",
      "enabled": true,
      "capacity": 50000
    }
  ]
}
```

**DER Field Reference**:
| DER Type | Field | Unit | Description |
|----------|-------|------|-------------|
| pv | `enabled` | - | Enable/disable publishing |
| pv | `rated_power` | W | Inverter rated power |
| pv | `installed_power` | W | Actual installed panel power (kWp) |
| battery | `enabled` | - | Enable/disable publishing |
| battery | `rated_power` | W | Battery inverter rated power |
| battery | `capacity` | Wh | Battery capacity |
| meter | `enabled` | - | Enable/disable publishing |
| v2x_charger | `enabled` | - | Enable/disable publishing |

**Errors**:
- 404 - Device not found

### POST `/api/devices/{sn}/ders`

Update publish flags and static DER metadata in one request. For PV entries, supply `rated_power` in watts. For battery entries, supply `rated_power` (W) and `capacity` (Wh). For v2x_charger entries, power limits are read-only from the device. `enabled` is optional here; omit it to leave the current publish state untouched. Only the DERs included in the payload are modified.

**Request**:
```json
{
  "ders": [
    {
      "type": "pv",
      "rated_power": 10200
    },
    {
      "type": "battery",
      "enabled": true,
      "rated_power": 5000,
      "capacity": 12800
    }
  ]
}
```

**Response** (200):
```json
{ "message": "DERs updated", "sn": "INV003SIM03" }
```

**Errors**:
- 400 - Missing ders array
- 404 - Device not found
- 500 - Failed to persist config

### GET `/api/devices/{sn}/registers/{address}`

Read Modbus register(s).

**Example**: `GET /api/devices/INV003SIM03/registers/13045?type=u32&endianness=little&scale_factor=0.1&function_code=3`

**Query Parameters**:
- `type` (optional, default: `u16`) - Data type: `u16`, `i16`, `u32`, `i32`, `f32`, `u64`, `i64`, `str`
- `size` (optional) - Number of registers (1-125). Required for `str`, overrides count for others.
- `endianness` (optional, default: `little`) - Byte order: `little` or `big`
- `scale_factor` (optional, default: 1.0) - Multiply raw value (not for `str`)
- `function_code` (optional, default: 4) - `3` (holding) or `4` (input)

**Response** (200):
```json
{
  "address": 13045,
  "value": 523.4,
  "type": "u32",
  "registers": 2
}
```

**Bulk read** (no type, only size):
```json
{
  "address": 13045,
  "count": 10,
  "values": ["0x0001", "0x0002", "0x0003", ...]
}
```

**String read**:
```json
{
  "address": 4989,
  "value": "SH10RT12345",
  "type": "str",
  "registers": 10
}
```

**Errors**:
- 400 - Invalid type/size or non-Modbus device
- 404 - Device not found
- 500 - Read failed
- 503 - Device busy

### POST `/api/devices/{sn}/registers`

Write one or more holding registers (FC 0x06). Each key in the `registers` object is an address, each value is a 16-bit register value. Writes are executed sequentially with a 50 ms inter-write delay.

**Example**: `POST /api/devices/INV003SIM03/registers`

**Request**:
```json
{
  "registers": {
    "33010": 5000,
    "33011": 1234
  }
}
```

**Response** (200):
```json
{
  "written": 2,
  "failed": 0
}
```

**Errors**:
- 400 - Missing `registers` object or non-Modbus device
- 404 - Device not found
- 500 - One or more writes failed (check written/failed counts)
- 503 - Device busy (lock timeout)

---

## Control & Operations

### POST `/api/control/{sn}/init`

Initialize control for a device (e.g. take control of inverter).

**Response** (202):
```json
{
  "status": "queued",
  "sn": "INV003SIM03",
  "action": "init"
}
```

**Errors**:
- 400 - Invalid request

### POST `/api/control/{sn}/battery`

Set battery charge/discharge power.

**Request**:
```json
{
  "power_w": 1000,
  "command_id": "optional-uuid"
}
```
*Positive value = Charge, Negative value = Discharge*

**Response** (202):
```json
{
  "status": "queued",
  "sn": "INV003SIM03",
  "action": "battery",
  "power_w": 1000
}
```

**Errors**:
- 400 - Missing `power_w`

### POST `/api/control/{sn}/curtail`

Set PV curtailment (limit solar generation).

**Request**:
```json
{ "power_w": 5000 }
```

**Response** (202):
```json
{
  "status": "queued",
  "sn": "INV003SIM03",
  "action": "curtail",
  "power_w": 5000
}
```

**Errors**:
- 400 - Missing `power_w`

### POST `/api/control/{sn}/curtail/disable`

Disable PV curtailment.

**Response** (202):
```json
{
  "status": "queued",
  "sn": "INV003SIM03",
  "action": "curtail_disable"
}
```

**Errors**:
- 400 - Invalid request

### POST `/api/control/{sn}/deinit`

Release control of device (return to default/self-consumption mode).

**Response** (202):
```json
{
  "status": "queued",
  "sn": "INV003SIM03",
  "action": "deinit"
}
```

**Errors**:
- 400 - Invalid request

---

## Diagnostics

### POST /api/network/port-check

Check if a TCP port is open on a remote host. Useful for verifying network connectivity to Modbus devices or brokers before adding them.

**Request**:
```json
{
  "host": "192.168.1.60",
  "port": 502,
  "timeout": 2000
}
```
*Note: `timeout` is optional (default: 2000ms).*

**Response** (200):
```json
{
  "host": "192.168.1.60",
  "port": 502,
  "open": true
}
```

**Errors**:
- 400 - Missing `host` or `port`

### POST /api/network/scan

Scan the Zap's local subnet for hosts with open TCP ports, e.g. to find Modbus devices.

**Request** (all fields optional):
```json
{
  "ports": [502, 1883],
  "timeout": 500,
  "batch_size": 12
}
```
- `ports`: up to 8 ports, default `[502]`.
- `timeout`: per-connection timeout in ms, default 500, clamped to 50–5000.
- `batch_size`: number of parallel probes, default 12.

The scan can take a while on a /24 network. At most 64 hosts are returned.

**Response** (200):
```json
{
  "status": "success",
  "subnet": "192.168.1.0/24",
  "hosts_found": 1,
  "hosts": [
    { "ip": "192.168.1.60", "ports": [502] }
  ]
}
```

**Errors**:
- 503 - Network interface not available

### POST /api/modbus/read

Ad-hoc Modbus register read without requiring a registered device. Connects, reads, and disconnects automatically.

**Request**:
```json
{
  "ip": "192.168.1.60",
  "port": 502,
  "unit_id": 1,
  "register": 13001,
  "count": 5,
  "register_type": "holding"
}
```

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `ip` | Yes | - | Modbus device IP |
| `port` | Yes | - | Modbus device port |
| `unit_id` | Yes | - | Modbus unit/slave ID |
| `register` | Yes | - | Starting register address |
| `count` | No | 1 | Number of registers to read (1-125) |
| `register_type` | No | `"holding"` | `"holding"` (function code 3) or `"input"` (function code 4) |

**Response** (200):
```json
{
  "ip": "192.168.1.60",
  "port": 502,
  "unit_id": 1,
  "register": 13001,
  "register_type": "holding",
  "values": [1, 0, 5000, 0, 100]
}
```

**Errors**:
- 400 - Missing required field or invalid config
- 502 - Connection failed or read failed

---

## Identity & Security

### GET /api/crypto

Get device identity information. `serialNumber` is the device ID. `publicKey` is the P-256 public key as 128 hex characters. `deviceName` is always `"software_zap"`.

**Response** (200):
```json
{
  "deviceName": "software_zap",
  "serialNumber": "zap-0000a1b2c3d4e5f6",
  "publicKey": "<128 hex chars>"
}
```

### POST /api/crypto/sign

Sign a message with the device's private key.

**Request**:
```json
{
  "message": "optional-message-content",
  "timestamp": "optional-timestamp"
}
```

**Response** (200):
```json
{
  "sign": "3045022100...",
  "message": "optional-message-content|nonce|timestamp|serial"
}
```

**Errors**:
- 400 - Pipe character (`|`) in message or timestamp

### GET /api/name

Get device name (ID).

**Response** (200):
```json
{
  "name": "zap-0000a1b2c3d4e5f6"
}
```

---

## Utilities

### GET /api/debug

Get debug report.

**Response** (200):
```json
{
  "status": "success",
  "heap": { ... },
  "tasks": [ ... ]
}
```

### POST /api/echo

Echo the request body.

**Request**:
```json
{ "any": "content" }
```

**Response** (200):
```json
{
  "echo": "{\"any\":\"content\"}"
}
```

---

## Reference

### Status Codes

| Code | Meaning |
|------|---------|
| **200** | OK — request succeeded |
| **201** | Created — resource was created |
| **202** | Accepted — async operation queued |
| **204** | No Content — no data available yet |
| **207** | Multi-Status — partial success (some operations failed) |
| **400** | Bad Request — invalid JSON, missing fields, or bad parameter values |
| **404** | Not Found — resource does not exist |
| **405** | Method Not Allowed — wrong HTTP verb for this endpoint |
| **409** | Conflict — resource already exists or operation conflicts |
| **500** | Internal Server Error — operation failed |
| **501** | Not Implemented — endpoint exists but feature is not yet built |
| **502** | Bad Gateway — upstream connection or communication failure |
| **503** | Service Unavailable — device busy, connection failed, or insufficient memory |

### Examples

**Add TCP device**:
```bash
curl -X POST http://192.168.1.100/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "type": "modbus_tcp",
    "ip": "192.168.1.50",
    "port": 502,
    "unit_id": 1,
    "profile": "sungrow"
  }'
```

**Add MQTT device (Ferroamp)**:
```bash
curl -X POST http://192.168.1.100/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "type": "mqtt",
    "profile": "ferroamp",
    "broker_host": "192.168.1.70",
    "broker_port": 1883,
    "username": "extapi",
    "password": "your_password"
  }'
```

**Add P1 UART device**:
```bash
curl -X POST http://192.168.1.100/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "type": "p1_uart",
    "manufacturer": "MyMeter",
    "baud_rate": 115200,
    "data_bits": 8,
    "parity": "none",
    "stop_bits": 1
  }'
```

**Read register (scaled)**:
```bash
curl "http://192.168.1.100/api/devices/INV003SIM03/registers/13045?type=u32&scale_factor=0.1"
```

**Write registers**:
```bash
curl -X POST http://192.168.1.100/api/devices/INV003SIM03/registers \
  -H "Content-Type: application/json" \
  -d '{"registers": {"33010": 5000}}'
```

**Get device data (JSON)**:
```bash
curl http://192.168.1.100/api/devices/INV003SIM03/data/json
```

**Get device data (Raw/OBIS)**:
```bash
curl http://192.168.1.100/api/devices/p1_meter/data/raw
```

**Remove device**:
```bash
curl -X DELETE http://192.168.1.100/api/devices/INV003SIM03
```

**Remove all devices**:
```bash
curl -X DELETE http://192.168.1.100/api/devices
```

### Notes

- Documented against firmware v2.3.27.
- The local API has no authentication; keep the Zap on a trusted network.

- Device configs persist in `/spiffs/devices/{sn}.json`
- Auto-reconnect every 10s for disconnected devices
- Modbus timeout: 1000ms per request
- UART pins fixed by firmware (RTU only configures baud/unit_id)
- Register read/write defaults to Input registers (use `function_code=3` for Holding)
- Wrong HTTP method returns 405
- **ESP32-C3 (ZAP)**: P1 (UART1) and Modbus RTU (UART0) can run simultaneously
- **ZAP Hardware Variants**: RS-485 requires the RS-485 module variant. The firmware detects the hardware via SENSE pins and warns if attempting RS-485 on incompatible hardware.
