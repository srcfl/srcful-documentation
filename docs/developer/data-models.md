---
sidebar_position: 3
slug: /developer/data-models
pagination_prev: null
---

# Data Models

This document describes Sourceful's data model architecture, covering both the logical hierarchy of resources and the telemetry data structures for distributed energy resources.

## Platform Hierarchy

Sourceful organizes energy resources in a four-level hierarchy:

### 1. WALLET → 2. SITE → 3. DEVICE → 4. DER

### WALLET (Permission Layer)

The **Wallet** is the top-level authentication and authorization entity. It represents:

- User identity and ownership
- Permission boundaries (OAuth-style scopes)
- Access control for all resources beneath it
- The entity that grants or revokes access to applications

A Wallet can own multiple Sites. See [Authentication & Permissioning](/developer/auth) for details on OAuth-style access patterns.

### SITE (Logical Grouping)

A **Site** represents a complete energy system - everything "behind the meter":

- The logical boundary for EMS optimization
- Typically corresponds to a physical location (home, building, facility)
- Contains all energy resources at that location
- The level where energy flows are balanced and optimized

**Example Site composition:**

- Grid connection point (meter)
- Solar panels (PV)
- Battery storage
- EV charger
- Hybrid inverter
- Heat pump

The Site concept is crucial because energy optimization happens at this level - you're optimizing the whole system, not individual devices in isolation.

### DEVICE (Physical Connection Point)

A **Device** represents the physical hardware you communicate with and control:

- The actual communication endpoint (Modbus address, MQTT client, P1 port)
- Often the electrical connection point
- What the Zap directly talks to via protocols

**Examples:**

- Hybrid inverter (Modbus-TCP device)
- EV charger (MQTT device)
- Smart meter (P1 device)
- Battery management system (Modbus-RTU device)

One Device may expose multiple DERs (see below).

### DER (Distributed Energy Resource)

A **DER** is the logical representation of an energy resource or function:

- What the energy system "sees" and models
- The unit of energy generation, storage, or consumption
- Can be a physical component or a logical representation

**Important concept:** DERs are often representations of capabilities "under" a Device, not always directly controllable entities.

**Example: Hybrid Inverter**

- **DEVICE**: The inverter itself (communication/control point via Modbus)
- **DER #1**: Solar PV (generation capability)
- **DER #2**: Battery (storage capability)
- **DER #3**: Grid connection (import/export capability)

You control the **Device** (inverter), but you represent its capabilities as separate **DERs** (PV, battery). You cannot directly control the battery - you control the inverter which manages the battery - but you still model the battery as a distinct DER for optimization purposes.

**DER Types:**

- **PV (Photovoltaic)**: Solar generation
- **Battery**: Energy storage
- **Meter**: Grid import/export measurement
- **Charger**: EV charger (uni- or bi-directional)
- **Flexible Load**: Controllable consumption (heat pumps, HVAC, etc.)

## Hierarchy Example

```
WALLET: user_abc123
  └─ SITE: home_main_street
      ├─ DEVICE: hybrid_inverter_01 (Modbus-TCP)
      │   ├─ DER: pv_rooftop (Solar PV)
      │   └─ DER: battery_01 (Home Battery)
      ├─ DEVICE: ev_charger_01 (MQTT)
      │   └─ DER: tesla_model3 (Charger)
      └─ DEVICE: smart_meter_01 (P1)
          └─ DER: grid_meter (Meter)
```

In this example:

- The hybrid inverter is one physical device, but exposes two DER capabilities
- Each Device may use a different protocol
- The Site optimizes across all DERs as a coordinated system
- The Wallet controls access permissions for the entire hierarchy

---

## Telemetry Data Models

The following sections describe the standardized telemetry data structures for DER types. Each DER type inherits from a common base structure while adding resource-specific fields.

- [Base Structure](#base-structure)
  - [DERData Root Structure](#derdata-root-structure)
  - [Inheritance Model](#inheritance-model)
- [Units and Conventions](#units-and-conventions)
  - [Units](#units)
  - [Sign Conventions](#sign-conventions)
- [Device Types](#device-types)
  - [BaseDeviceData](#basedevicedata)
  - [PV Data Model](#pv-data-model)
  - [Battery Data Model](#battery-data-model)
  - [Meter Data Model](#meter-data-model)

## Base Structure

### DERData Root Structure

The root data structure can contain up to three subsystems:

- **pv**: Photovoltaic system data
- **battery**: Battery storage system data
- **meter**: Meter data

### Inheritance Model

All device types inherit from `BaseDeviceData`:

```json
{
  "type": "pv",
  "make": "Deye",
  "timestamp": 1755701251122,
  "read_time_ms": 42
}
```

## Units and Conventions

### Units

All measurements use base SI units:

- **Power**: W (watts)
- **Energy**: Wh (watt-hours)
- **Voltage**: V (volts)
- **Current**: A (amperes)
- **Frequency**: Hz (hertz)
- **Temperature**: °C (Celsius)
- **State of Charge**: fraction (0.0 = empty, 1.0 = full)
- **Time**: s (seconds), ms (milliseconds for timestamps)

### Sign Conventions

- **Generation**: Negative power (PV: `W < 0`)
- **Charging**: Positive power/current (Battery: `W > 0`, `A > 0`)
- **Discharging**: Negative power/current (Battery: `W < 0`, `A < 0`)
- **Import**: Positive power (Meter: `W > 0`)
- **Export**: Negative power (Meter: `W < 0`)
- **Energy Totals**: Always positive values

## Device Types

### BaseDeviceData

Common fields shared by all device types:

| Field          | Unit         | Data Type | Description                            |
| -------------- | ------------ | --------- | -------------------------------------- |
| `type`         | -            | string    | Object type ("pv", "battery", "meter") |
| `make`         | -            | string    | Manufacturer/brand name (optional)     |
| `timestamp`    | milliseconds | integer   | Timestamp of reading start             |
| `read_time_ms` | milliseconds | integer   | Time taken to complete the reading     |

### PV Data Model

Photovoltaic system data with solar generation metrics:

**Example:**

```json
{
  "type": "pv",
  "make": "Deye",
  "W": -1500,
  "rated_power_W": 3000,
  "mppt1_V": 400,
  "mppt1_A": -3.75,
  "mppt2_V": 380,
  "mppt2_A": -3.68,
  "heatsink_C": 45,
  "total_generation_Wh": 15000
}
```

**Fields:**

| Field                 | Unit | Data Type | Description                                                     |
| --------------------- | ---- | --------- | --------------------------------------------------------------- |
| `W`                   | W    | integer   | Power Generation (always negative)                              |
| `rated_power_W`       | W    | integer   | System Rated Power                                              |
| `mppt1_V`             | V    | float     | MPPT1 Voltage                                                   |
| `mppt1_A`             | A    | float     | MPPT1 Current                                                   |
| `mppt2_V`             | V    | float     | MPPT2 Voltage                                                   |
| `mppt2_A`             | A    | float     | MPPT2 Current                                                   |
| `heatsink_C`          | °C   | float     | Inverter Temperature                                            |
| `total_generation_Wh` | Wh   | integer   | Total Energy Generated                                          |

### Battery Data Model

Battery storage system data with charge/discharge metrics:

**Example:**

```json
{
  "type": "battery",
  "make": "Tesla",
  "W": 500,
  "A": 10.5,
  "V": 48.2,
  "SoC_nom_fract": 0.75,
  "heatsink_C": 25,
  "total_charge_Wh": 8000,
  "total_discharge_Wh": 7200
}
```

**Fields:**

| Field                | Unit     | Data Type | Description                                                                                             |
| -------------------- | -------- | --------- | ------------------------------------------------------------------------------------------------------- |
| `W`                  | W        | integer   | Active Power (+ charge, - discharge)                                                                    |
| `A`                  | A        | float     | Current (+ charge, - discharge)                                                                         |
| `V`                  | V        | float     | Voltage                                                                                                 |
| `SoC_nom_fract`      | fraction | float     | State of Charge (0.0-1.0)                                                                               |
| `heatsink_C`         | °C       | float     | Battery Temperature                                                                                     |
| `total_charge_Wh`    | Wh       | integer   | Total Energy Charged                                                                                    |
| `total_discharge_Wh` | Wh       | integer   | Total Energy Discharged                                                                                 |

### Meter Data Model

Grid meter data with import/export and phase-level measurements:

**Example:**

```json
{
  "type": "meter",
  "make": "Kamstrup",
  "W": 1200,
  "Hz": 50.0,
  "L1_V": 230,
  "L1_A": 5.2,
  "L1_W": 400,
  "L2_V": 229,
  "L2_A": 5.1,
  "L2_W": 380,
  "L3_V": 231,
  "L3_A": 5.3,
  "L3_W": 420,
  "total_import_Wh": 25000,
  "total_export_Wh": 18000
}
```

**Fields:**

| Field             | Unit | Data Type | Description                             |
| ----------------- | ---- | --------- | --------------------------------------- |
| `W`               | W    | integer   | Total Active Power (+ import, - export) |
| `Hz`              | Hz   | float     | Grid Frequency                          |
| `L1_V`            | V    | float     | L1 Phase Voltage                        |
| `L1_A`            | A    | float     | L1 Phase Current                        |
| `L1_W`            | W    | float     | L1 Phase Power                          |
| `L2_V`            | V    | float     | L2 Phase Voltage                        |
| `L2_A`            | A    | float     | L2 Phase Current                        |
| `L2_W`            | W    | float     | L2 Phase Power                          |
| `L3_V`            | V    | float     | L3 Phase Voltage                        |
| `L3_A`            | A    | float     | L3 Phase Current                        |
| `L3_W`            | W    | float     | L3 Phase Power                          |
| `total_import_Wh` | Wh   | integer   | Total Energy Imported                   |
| `total_export_Wh` | Wh   | integer   | Total Energy Exported                   |

### Charger Data Model

EV charger data with charge/discharge metrics and phase-level measurements. This DER type represents the charger's capability as a flexible load/source (uni- or bi-directional), with optional vehicle-specific attributes.

**Example:**

```json
{
  "type": "charger",
  "make": "Ambibox",
  "timestamp": 1731573040000,
  "read_time_ms": 42,
  "W": 6400,
  "L1_V": 228.03,
  "L1_A": 9.228,
  "L1_W": 2104,
  "L2_V": 227.92,
  "L2_A": 9.333,
  "L2_W": 2127,
  "L3_V": 227.62,
  "L3_A": 9.444,
  "L3_W": 2150,
  "offered_A": 10.0,
  "connected": true,
  "charging": true,
  "vehicle_id": "my_tesla_model3",
  "vehicle_capacity_Wh": 75000,
  "vehicle_SoC_fract": 0.65,
  "SoC_source": "vehicle",
  "capacity_source": "user",
  "total_import_Wh": 3623394,
  "total_export_Wh": 12000,
  "session_import_Wh": 15200,
  "session_export_Wh": 0
}
```

**Fields:**

| Field                | Unit      | Data Type | Description                                                                 |
|----------------------|-----------|-----------|-----------------------------------------------------------------------------|
| `W`                  | W         | integer   | Active Power (+ charge/import to vehicle, - discharge/export from vehicle) |
| `L1_V`               | V         | float     | L1 Phase Voltage                                                            |
| `L1_A`               | A         | float     | L1 Phase Current                                                            |
| `L1_W`               | W         | float     | L1 Phase Power (computed as V * A)                                          |
| `L2_V`               | V         | float     | L2 Phase Voltage                                                            |
| `L2_A`               | A         | float     | L2 Phase Current                                                            |
| `L2_W`               | W         | float     | L2 Phase Power (computed as V * A)                                          |
| `L3_V`               | V         | float     | L3 Phase Voltage                                                            |
| `L3_A`               | A         | float     | L3 Phase Current                                                            |
| `L3_W`               | W         | float     | L3 Phase Power (computed as V * A)                                          |
| `offered_A`          | A         | float     | Current offered by charger (from OCPP)                                      |
| `connected`          | -         | boolean   | Is a vehicle connected?                                                     |
| `charging`           | -         | boolean   | Is active charging/discharging occurring?                                   |
| `vehicle_id`         | -         | string, optional | User-supplied or detected vehicle reference (null if unknown)        |
| `vehicle_capacity_Wh`| Wh        | integer, optional | Vehicle battery capacity (null if unknown)                           |
| `vehicle_SoC_fract`  | fraction  | float, optional | State of Charge (0.0-1.0, null if unknown)                            |
| `SoC_source`         | -         | string, optional | Data source ("vehicle", "estimated", "manual", "unknown")     |
| `capacity_source`    | -         | string, optional | Data source ("vehicle", "user", "default")                      |
| `total_import_Wh`    | Wh        | integer   | Total Energy Imported (lifetime charge energy)                              |
| `total_export_Wh`    | Wh        | integer   | Total Energy Exported (lifetime discharge energy; 0 if no V2G support)     |
| `session_import_Wh`  | Wh        | integer   | Session Energy Imported (reset on connect/disconnect)                       |
| `session_export_Wh`  | Wh        | integer   | Session Energy Exported (reset on connect/disconnect)                       |


### Thoughts on UX and Defaults for Launch

For December (V2X-launch), prioritize minimal viable: Run with Alt A (automatic + override) – it's user-friendly without being annoying. At connect (detect via OCPP):

1. If Ambibox/ISO 15118: Pull SoC/capacity auto.

2. Otherwise: Prompt "Car connected on charger X. Is it your [last/default car]? Yes/No" – choose from registry.

3. Override: Always button for manual SoC/input.
