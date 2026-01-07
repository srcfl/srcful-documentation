---
sidebar_position: 6
slug: /developer/zap-local-api
---

# REST API Reference

Complete endpoint documentation for the Zap firmware.

## Table of Contents

1. [System & Network](#system--network)
   - [System Info](#get-apisystem)
   - [System Reboot](#post-apisystemreboot)
   - [Factory Reset](#post-apisystemfactory-reset)
   - [WiFi Status](#get-apiwifi)
   - [WiFi Config](#post-apiwifi)
   - [WiFi Reset](#delete-apiwifi)
   - [WiFi Scan](#get-apiwifiscan)
2. [Device Management](#device-management)
   - [Supported Devices](#get-apidevicessupported)
   - [Connection Types](#get-apidevicestypes)
   - [List Devices](#get-apidevices)
   - [Add Device](#post-apidevices)
   - [Remove Device](#delete-apidevices-sn)
   - [Device Data](#get-apidevices-sn-datajson)
   - [Update DER Types](#post-apidevices-sn-types)
   - [Get DER Metadata](#get-apidevices-sn-ders)
   - [Update DER Metadata](#post-apidevices-sn-ders)
   - [Read Registers](#get-apidevices-sn-registersaddress)
   - [Write Register](#post-apidevices-sn-registersaddress)
3. [Control & Operations](#control--operations)
   - [Init Control](#post-apicontrol-sn-init)
   - [Battery Control](#post-apicontrol-sn-battery)
   - [PV Curtailment](#post-apicontrol-sn-curtail)
   - [Disable Curtailment](#post-apicontrol-sn-curtaildisable)
   - [Deinit Control](#post-apicontrol-sn-deinit)
   - [MQTT Topics](#mqtt-control-topics)
4. [Identity & Security](#identity--security)
   - [Crypto Info](#get-apicrypto)
   - [Sign Message](#post-apicryptosign)
   - [Device Name](#get-apiname)
5. [Utilities](#utilities)
   - [Debug Info](#get-apidebug)
   - [Echo](#post-apiecho)
6. [Reference](#reference)
   - [Status Codes](#status-codes)
   - [Examples](#examples)
   - [Notes](#notes)

---

## Base URL

All endpoints prefixed with `/api/`.

Example: `http://192.168.1.100/api/system`

---

## System & Network

### GET /api/system

System info, memory, WiFi status, uptime.

**Response** (200):
```json
{
  "time_utc_sec": 1697515200,
  "uptime_seconds": 123456,
  "temperature_celsius": 0.0,
  "memory_kb": {
    "total": 4096.0,
    "free": 2560.0,
    "used": 1536.0,
    "percent_used": 37.5,
    "min": 2048.0,
    "largest": 1024.0
  },
  "processes_average": {
    "last_1min": 0,
    "last_5min": 0,
    "last_15min": 0
  },
  "logging": {
    "enabled": true,
    "level": 4
  },
  "zap": {
    "deviceId": "abc123",
    "cpuFreqMHz": 160,
    "flashSizeMB": 0.0,
    "sdkVersion": "v5.1",
    "firmwareVersion": "1.0.0",
    "publicKey": "04a1b2c3...",
    "network": {
      "wifiStatus": "connected",
      "wifiConnected": true,
      "localIP": "192.168.1.100",
      "ssid": "MyNetwork",
      "rssi": -45,
      "internetConnected": true
    }
  }
}
```

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

Factory reset the device. Clears all device configurations and WiFi credentials, then reboots.

**Response** (200):
```json
{
  "message": "Factory reset successful. Rebooting in 2 seconds."
}
```

### POST /api/system/log_stream

Toggle real-time log streaming to MQTT. When enabled, device logs are published to `logs/{gateway_id}/raw`.

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

### GET /api/wifi

Get WiFi status and scan results.

**Response** (200):
```json
{
  "ssids": [
    { "ssid": "Network1", "rssi": -60, "auth": "WPA2" },
    { "ssid": "Network2", "rssi": -80, "auth": "OPEN" }
  ],
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

---

## Device Management

### GET /api/devices/supported

List supported device profiles.

**Response** (200):
```json
{
  "count": 3,
  "inverters": [
    { 
      "display_name": "Sungrow", 
      "profile": "sungrow",
      "connection_types": ["modbus_tcp", "modbus_rtu"]
    },
    { 
      "display_name": "Solis", 
      "profile": "solis",
      "connection_types": ["modbus_tcp", "modbus_rtu"]
    }
  ],
  "meters": [
    {
      "display_name": "P1 Meter",
      "profile": "p1_meter",
      "connection_types": ["p1_uart"]
    }
  ],
  "ev_chargers": [
    {
      "display_name": "Ambibox",
      "profile": "ambibox",
      "connection_types": ["mqtt"]
    }
  ]
}
```

### GET /api/devices/types

List all possible connection types and their required/optional parameters for creating a device.

**Response** (200):
```json
{
  "connection_types": [
    {
      "type": "modbus_tcp",
      "description": "Modbus TCP connection",
      "parameters": [
        { "name": "ip", "type": "string", "required": true },
        { "name": "port", "type": "integer", "required": true, "default": 502 },
        { "name": "unit_id", "type": "integer", "required": true, "default": 1 },
        { "name": "profile", "type": "string", "required": true }
      ]
    },
    {
      "type": "modbus_rtu",
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
    {
      "type": "p1_uart",
      "description": "P1 Port (DSMR) connection",
      "parameters": [
        { "name": "manufacturer", "type": "string", "required": false },
        { "name": "baud_rate", "type": "integer", "required": true, "default": 115200 },
        { "name": "data_bits", "type": "integer", "required": true, "default": 8 },
        { "name": "parity", "type": "string", "required": false, "default": "none", "description": "none, even, odd" },
        { "name": "stop_bits", "type": "integer", "required": false, "default": 1 }
      ]
    },
    {
      "type": "mqtt",
      "description": "MQTT connection",
      "parameters": [
        { "name": "broker_host", "type": "string", "required": true },
        { "name": "broker_port", "type": "integer", "required": true, "default": 1883 },
        { "name": "username", "type": "string", "required": false },
        { "name": "password", "type": "string", "required": false },
        { "name": "client_id", "type": "string", "required": false }
      ]
    }
  ]
}
```

### GET /api/devices

List all configured devices. Each entry is the persisted config augmented with runtime:
- `connected`: boolean – current connection state
- `last_harvest`: unix ms timestamp of most recent DER data (omitted if none yet)
- `path`: string – the path to the configuration file in SPIFFS (e.g. `spiffs/devices/6178e775.json`)
- `ders`: per-DER entries (pv/battery/meter/v2x_charger) with publish flags; PV entries also expose `installed_power` (W) alongside persisted `rated_power` (W) and battery `capacity` (Wh)

**Response** (200):
```json
{
  "count": 2,
  "devices": [
    {
      "type": "modbus_tcp",
      "ip": "192.168.1.60",
      "port": 502,
      "unit_id": 1,
      "profile": "sungrow",
      "sn": "INV003SIM03",
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
      "broker_host": "192.168.1.50",
      "broker_port": 1883,
      "username": "user",
      "client_id": "esp32_local",
      "sn": "ambibox_192.168.1.50",
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

Add device. Connects immediately, saved only on success.

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

**Modbus RTU**:
```json
{
  "type": "modbus_rtu",
  "baud_rate": 9600,
  "unit_id": 1,
  "profile": "sungrow",
  "parity": 0
}
```

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

**Errors**:
- 400 - Invalid config
- 409 - Device exists or conflicts (UART/TCP endpoint)
- 503 - Connection failed or insufficient memory (requires >55KB free heap)

### DELETE /api/devices/{sn}

Remove device by serial number.

**Example**: `DELETE /api/devices/INV003SIM03`

**Response** (200):
```json
{ "message": "Device removed" }
```

**Errors**:
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

### GET /api/devices/{sn}/data/json

Latest device data snapshot in JSON format.

**Example**: `GET /api/devices/INV003SIM03/data/json`

**Response** (200):
```json
{
  "pv": {
    "type": "pv",
    "timestamp": 1761832393075,
    "read_time_ms": 472,
    "make": "Sungrow",
    "W": 2500,
    "total_generation_Wh": 22698000
  },
  "battery": {
    "type": "battery",
    "timestamp": 1761832393075,
    "make": "ambibox",
    "sessionState": "CHARGE_LOOP",
    "W": -500,
    "soc_percent": 85
  },
  "meter": { /* ... if present ... */ },
  "version": "v0",
  "format": "sungrow"
}
```

**Errors**:
- 204 - No harvest data yet
- 404 - Device not found

### POST /api/devices/{sn}/types

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

**Errors**:
- 400 - Missing ders array
- 404 - Device not found
- 500 - Failed to persist config

### GET /api/devices/{sn}/ders

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
| v2x_charger | `capacity` | Wh | EV battery capacity |

**Errors**:
- 404 - Device not found

### POST /api/devices/{sn}/ders

Update publish flags and static DER metadata in one request. For PV entries, supply `rated_power` in watts. For battery entries, supply `rated_power` (W) and `capacity` (Wh). For v2x_charger entries, supply `capacity` (Wh); power limits are read-only from the device. `enabled` is optional here; omit it to leave the current publish state untouched. Only the DERs included in the payload are modified.

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

### GET /api/devices/{sn}/registers/{address}

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

### POST /api/devices/{sn}/registers/{address}

Write single holding register.

**Example**: `POST /api/devices/INV003SIM03/registers/33010`

**Request**:
```json
{ "value": 5000 }
```

**Response** (200):
```json
{
  "message": "Register written successfully",
  "address": 33010,
  "value": 5000
}
```

**Errors**:
- 400 - Missing value or non-Modbus device
- 404 - Device not found
- 500 - Write failed

### POST /api/devices/{sn}/registers

Batch write multiple holding registers.

**Example**: `POST /api/devices/INV003SIM03/registers`

**Request**:
```json
{
  "33010": 5000,
  "33011": 1234
}
```

**Response** (200):
```json
{
  "message": "Batch write completed",
  "success": 2,
  "failed": 0
}
```

**Errors**:
- 400 - Invalid JSON or non-Modbus device
- 404 - Device not found
- 207 - Partial success (check success/failed counts)

### POST /api/devices/{sn}/write

Write single holding register (Legacy/Alternative).

**Example**: `POST /api/devices/INV003SIM03/write`

**Request**:
```json
{
  "addr": 33010,
  "value": 5000
}
```

**Response** (200):
```json
{
  "message": "Register written successfully"
}
```

**Errors**:
- 400 - Missing addr/value or non-Modbus device
- 404 - Device not found or write failed

---

## Control & Operations

### POST /api/control/{sn}/init

Initialize control for a device (e.g. take control of inverter).

**Response** (202):
```json
{
  "status": "queued",
  "sn": "INV003SIM03",
  "action": "init"
}
```

### POST /api/control/{sn}/battery

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

### POST /api/control/{sn}/curtail

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

### POST /api/control/{sn}/curtail/disable

Disable PV curtailment.

**Response** (202):
```json
{
  "status": "queued",
  "sn": "INV003SIM03",
  "action": "curtail_disable"
}
```

### POST /api/control/{sn}/deinit

Release control of device (return to default/self-consumption mode).

**Response** (202):
```json
{
  "status": "queued",
  "sn": "INV003SIM03",
  "action": "deinit"
}
```

### MQTT Control Topics

The firmware subscribes to the following topics for backend control.

#### Battery Control

**Topic**: `control/{gateway_id}/battery/+/ems/commands`
**Wildcard**: `+` is the device serial number.

**Payload**:
```json
{
  "power_w": 1000,
  "command_id": "optional-uuid"
}
```

#### PV Curtailment

**Topic**: `control/{gateway_id}/pv/+/ems/commands`
**Wildcard**: `+` is the device serial number.

**Payload**:
```json
{
  "power_w": 5000
}
```

---

## Identity & Security

### GET /api/crypto

Get device identity information.

**Response** (200):
```json
{
  "deviceName": "software_zap",
  "serialNumber": "abc123def456",
  "publicKey": "04a1b2c3..."
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

### GET /api/name

Get device name (ID).

**Response** (200):
```json
{
  "name": "abc123def456"
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

- **200** OK
- **201** Created
- **204** No Content
- **400** Bad Request
- **404** Not Found
- **405** Method Not Allowed
- **409** Conflict
- **500** Internal Server Error
- **501** Not Implemented
- **503** Service Unavailable

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

**Write register**:
```bash
curl -X POST http://192.168.1.100/api/devices/INV003SIM03/registers/33010 \
  -H "Content-Type: application/json" \
  -d '{"value": 5000}'
```

**Get device data**:
```bash
curl http://192.168.1.100/api/devices/INV003SIM03/data/json
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

- Device configs persist in `/spiffs/devices/{sn}.json`
- Auto-reconnect every 10s for disconnected devices
- Modbus timeout: 1000ms per request
- UART pins fixed by firmware (RTU only configures baud/unit_id)
- Register read/write defaults to Input registers (use `function_code=3` for Holding)
- Wrong HTTP method returns 405
