---
sidebar_position: 3
slug: /developer/data-models
pagination_prev: null
---

# Data Models

Sourceful uses a standardized data model structure for Distributed Energy Resources (DER) data collection. The system supports three main device types: photovoltaic (PV) systems, battery storage systems (Home Batteries and EV Batteries), and meters. Each device type inherits from a common base structure while adding device-specific fields.

* [Base Structure](#base-structure)
    * [DERData Root Structure](#derdata-root-structure)
    * [Inheritance Model](#inheritance-model)
* [Units and Conventions](#units-and-conventions)
    * [Units](#units)
    * [Sign Conventions](#sign-conventions)
* [Device Types](#device-types)
    * [BaseDeviceData](#basedevicedata)
    * [PV Data Model](#pv-data-model)
    * [Battery Data Model](#battery-data-model)
    * [Meter Data Model](#meter-data-model)
* [Field Naming Convention](#field-naming-convention)

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

| Field          | Unit         | Data Type | Description                                   |
| -------------- | ------------ | --------- | --------------------------------------------- |
| `type`         | -            | string    | Object type ("pv", "battery", "meter")        |
| `make`         | -            | string    | Manufacturer/brand name (optional)            |
| `timestamp`    | milliseconds | integer   | Timestamp of reading start                    |
| `read_time_ms` | milliseconds | integer   | Time taken to complete the reading            |

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

| Field                 | Unit | Data Type | Description                            |
| --------------------- | ---- | --------- | -------------------------------------- |
| `W`                   | W    | float     | Power Generation (always negative) |
| `rated_power_W`       | W    | float     | System Rated Power                     |
| `mppt1_V`             | V    | float     | MPPT1 Voltage                          |
| `mppt1_A`             | A    | float     | MPPT1 Current                          |
| `mppt2_V`             | V    | float     | MPPT2 Voltage                          |
| `mppt2_A`             | A    | float     | MPPT2 Current                          |
| `heatsink_C`          | °C   | float     | Inverter Temperature                   |
| `total_generation_Wh` | Wh   | integer   | Total Energy Generated                 |

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

| Field                | Unit     | Data Type | Description                          |
| -------------------- | -------- | --------- | ------------------------------------ |
| `W`                  | W        | float     | Active Power (+ charge, - discharge) |
| `A`                  | A        | float     | Current (+ charge, - discharge)      |
| `V`                  | V        | float     | Voltage                              |
| `SoC_nom_fract`      | fraction | float     | State of Charge (0.0-1.0)            |
| `heatsink_C`         | °C       | float     | Battery Temperature                  |
| `total_charge_Wh`    | Wh       | integer   | Total Energy Charged                 |
| `total_discharge_Wh` | Wh       | integer   | Total Energy Discharged              |

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
| `W`               | W    | float     | Total Active Power (+ import, - export) |
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

