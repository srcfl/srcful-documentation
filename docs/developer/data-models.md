---
sidebar_position: 3
slug: /developer/data-models
pagination_prev: null
---

# Data Models

Sourceful uses standardized data models for collecting and processing Distributed Energy Resources (DER) data. This document explains the structure, conventions, and field definitions used across the platform.

## Table of Contents

* [Overview](#overview)
* [Hierarchy Structure](#hierarchy-structure)
* [Core Concepts](#core-concepts)
* [Wallet Data Model](#wallet-data-model)
* [Site Data Model](#site-data-model)
* [DER Data Models](#der-data-models)
* [Units and Conventions](#units-and-conventions)
* [Error Handling](#error-handling)
* [Standards Compliance](#standards-compliance)

## Overview

The Sourceful platform organizes energy data in a strict three-level hierarchy:

**Wallet → Site → DER**

- **Wallet**: Top-level container representing an owner/operator
- **Site**: Physical location with grid connection and multiple DER devices
- **DER**: Individual Distributed Energy Resource devices (PV, batteries, meters, etc.)

Each level has specific responsibilities and data models that support energy optimization, monitoring, and control.

## Hierarchy Structure

```
Wallet (Owner/Operator)
├── Site A (Physical Location)
│   ├── Grid Interface (Smart Meter)
│   ├── Generator (PV System)
│   ├── Storage (Home Battery)
│   └── Load (EV Charger)
├── Site B (Another Location)
│   ├── Grid Interface (Smart Meter)
│   └── Generator (Wind Turbine)
└── Site C (Commercial Site)
    ├── Grid Interface (Commercial Meter)
    ├── Generator (Large PV Array)
    ├── Storage (Commercial Battery)
    └── Load (Heat Pump)
```

### Data Flow

1. **DER devices** collect real-time measurements
2. **Site aggregation** provides energy balance and context
3. **Wallet aggregation** enables portfolio management
4. **External APIs** access data through GraphQL at any level

## Core Concepts

### Energy Functions

All DER devices are categorized by their primary energy function:

- **Generators**: Produce electricity (PV, wind, fuel cells)
- **Storage**: Store and discharge energy (batteries, V2G)
- **Grid Interfaces**: Measure grid connection (smart meters)
- **Loads**: Consume electricity (EV chargers, heat pumps)

### Controllability

Devices are classified as:
- **Controllable**: Can be remotely controlled (smart inverters, batteries)
- **Non-controllable**: Monitoring only (production meters, weather stations)

### Time Authority

All timestamps use Unix milliseconds (UTC) as the authoritative time source, ensuring consistent time-series alignment across the platform.

## Wallet Data Model

The wallet represents an owner or operator and contains multiple sites.

### Base Wallet Structure

```json
{
  "wallet_id": "wallet_xyz789",
  "owner": {
    "type": "individual",
    "name": "John Doe",
    "email": "john@example.com",
    "created_ts": 1700000000000
  },
  "portfolio_summary": {
    "total_sites": 3,
    "total_ders": 12,
    "total_capacity_mw": 0.045,
    "last_updated_ts": 1755701251122
  },
  "permissions": {
    "can_control": true,
    "can_export_data": true,
    "api_access_level": "full"
  }
}
```

### Wallet Fields

| Field                | Unit | Data Type | Description                           |
| -------------------- | ---- | --------- | ------------------------------------- |
| `wallet_id`          | -    | string    | Unique wallet identifier              |
| `owner.type`         | -    | string    | "individual", "business", "utility"   |
| `owner.name`         | -    | string    | Owner name or company                 |
| `total_sites`        | -    | integer   | Number of sites in portfolio          |
| `total_ders`         | -    | integer   | Total DER devices across all sites    |
| `total_capacity_mw`  | MW   | float     | Aggregate installed capacity          |

## Site Data Model

The site represents a physical location with a grid connection and multiple DER devices.

### Base Site Structure

```json
{
  "site_id": "site_abc123",
  "wallet_id": "wallet_xyz789",
  "location": {
    "name": "Home Solar System",
    "address": "123 Solar Street, Stockholm, Sweden",
    "coordinates": {
      "latitude": 59.3293,
      "longitude": 18.0686,
      "elevation_m": 25
    },
    "timezone": "Europe/Stockholm"
  },
  "grid_connection": {
    "amp_fuse_size": 20,
    "phase_configuration": "three_phase",
    "voltage_nominal_v": 400,
    "voltage_tolerance_pct": 10,
    "grid_region": "SE3",
    "dso_code": "ELLEVIO_001",
    "meter_point_id": "735999109012345678",
    "connection_type": "low_voltage"
  },
  "energy_balance": {
    "timestamp": 1755701251122,
    "pcc_total": {
      "W": 1200,
      "total_import_Wh": 450000,
      "total_export_Wh": 125000
    },
    "der_count": {
      "generator": 2,
      "storage": 1,
      "grid_interface": 1,
      "load": 1
    }
  },
  "capabilities": {
    "controllable_ders": 3,
    "total_ders": 5,
    "supports_optimization": true,
    "supports_v2g": true
  },
  "grid_signal": {
    "price_per_kWh": 0.15,
    "demand_response_active": false,
    "openadr_event_id": null,
    "last_updated_ts": 1755701251122
  }
}
```

### Site-Level Fields

| Field                      | Unit | Data Type | Description                                    |
| -------------------------- | ---- | --------- | ---------------------------------------------- |
| `site_id`                  | -    | string    | Unique site identifier                         |
| `wallet_id`                | -    | string    | Parent wallet identifier                       |
| `location.name`            | -    | string    | Human-readable site name                       |
| `location.address`         | -    | string    | Physical address                               |
| `coordinates.latitude`     | deg  | float     | GPS latitude (-90 to 90)                      |
| `coordinates.longitude`    | deg  | float     | GPS longitude (-180 to 180)                   |
| `coordinates.elevation_m`  | m    | float     | Elevation above sea level                      |
| `timezone`                 | -    | string    | IANA timezone identifier                       |

### Grid Connection Fields

| Field                    | Unit | Data Type | Description                                    |
| ------------------------ | ---- | --------- | ---------------------------------------------- |
| `amp_fuse_size`          | A    | integer   | Main fuse amperage rating                      |
| `phase_configuration`    | -    | string    | "single_phase", "three_phase"                  |
| `voltage_nominal_v`      | V    | integer   | Nominal grid voltage (230V single, 400V three) |
| `voltage_tolerance_pct`  | %    | float     | Allowed voltage deviation (±10%, per IEEE 1547) |
| `grid_region`            | -    | string    | Price/balancing region (SE1, SE2, SE3, SE4)   |
| `dso_code`               | -    | string    | Distribution System Operator identifier        |
| `meter_point_id`         | -    | string    | Unique meter point identifier                  |
| `connection_type`        | -    | string    | "low_voltage", "medium_voltage", "high_voltage" |

*Note: Grid specifications are critical for optimization algorithms to respect physical constraints and market participation. IEEE 1547 compliance ensures safe interconnection and grid support capabilities.*

### Grid Signal Fields (OpenADR Support)

| Field                    | Unit    | Data Type | Description                                    |
| ------------------------ | ------- | --------- | ---------------------------------------------- |
| `price_per_kWh`          | €/kWh    | float     | Current electricity price (OpenADR Price events) |
| `demand_response_active` | -       | boolean   | Active demand response event                   |
| `openadr_event_id`       | -       | string    | OpenADR event identifier (null if no event)   |
| `last_updated_ts`        | ms      | integer   | Last grid signal update timestamp             |

## DER Data Models

All DER devices inherit from a common base structure and add function-specific fields.

### Base DER Structure

Common fields shared by all device types:

```json
{
  "serial": "DEVICE123456789",
  "site_id": "site_abc123",
  "type": "generator",
  "subtype": "pv",
  "make": "Huawei",
  "model": "SUN2000-12KTL-M2",
  "controllable": false,
  "timestamp": 1755701251122,
  "read_time_ms": 42,
  "last_seen": 1755701251122,
  "status": "online",
  "data_quality": 0.98,
  "installation": {
    "timestamp": 1700000000000,
    "location": "rooftop_south",
    "commissioned": true
  },
  "optimization_fields": {
    "max_power_mw": 0.012,
    "efficiency_pct": 96
  },
  "standards_compliance": {
    "ieee_1547_category": "A",
    "iec_61850_node": "DPVC"
  },
  "error": null
}
```

### Base DER Fields

| Field              | Unit         | Data Type | Description                                   |
| ------------------ | ------------ | --------- | --------------------------------------------- |
| `serial`           | -            | string    | Unique device serial number                   |
| `site_id`          | -            | string    | Parent site identifier                        |
| `type`             | -            | string    | Energy function ("generator", "storage", "grid_interface", "load") |
| `subtype`          | -            | string    | Technology type ("pv", "battery", "ev_charger", etc.) |
| `make`             | -            | string    | Manufacturer name                             |
| `model`            | -            | string    | Device model                                  |
| `controllable`     | -            | boolean   | Can be remotely controlled                    |
| `timestamp`        | milliseconds | integer   | Reading timestamp (Unix ms, UTC)             |
| `read_time_ms`     | milliseconds | integer   | Time to complete reading                      |
| `last_seen`        | milliseconds | integer   | Last successful communication                 |
| `status`           | -            | string    | "online", "offline", "error", "maintenance"  |
| `data_quality`     | -            | float     | Data reliability score (0.0-1.0)             |

### Standards Compliance Fields

| Field                  | Unit | Data Type | Description                                   |
| ---------------------- | ---- | --------- | --------------------------------------------- |
| `ieee_1547_category`   | -    | string    | IEEE 1547 performance category ("A", "B", "C") |
| `iec_61850_node`       | -    | string    | IEC 61850 logical node type ("DPVC", "ZBAT", "MMXU", "ZEVN") |

### Optimization Fields

For devices compatible with optimization algorithms:

| Field            | Unit | Data Type | Description                                   |
| ---------------- | ---- | --------- | --------------------------------------------- |
| `max_power_mw`   | MW   | float     | Maximum power capability                      |
| `efficiency_pct` | %    | float     | Operating efficiency (0-100)                 |

*Note: Required for all controllable devices and optimization-relevant non-controllable devices.*

### Configuration Protocol Support

The `protocol` field in device configurations supports these standards-based protocols:

| Protocol          | Application                    | Standards Reference      |
| ----------------- | ------------------------------ | ------------------------ |
| `"ModbusTCP"`     | Generators, Storage, Meters    | SunSpec Modbus           |
| `"OCPP2.0.1"`     | EV Chargers                    | IEC 63110, ISO 15118     |
| `"Tesla_Gateway"` | Tesla Energy Products          | Proprietary (Tesla API)  |
| `"IEEE2030.5"`    | Advanced Grid Integration      | IEEE 2030.5 SEP 2.0      |

### Generator Data Model

Generators produce electricity from various energy sources.

```json
{
  "serial": "SUN2000123456789",
  "site_id": "site_abc123",
  "type": "generator",
  "subtype": "pv",
  "make": "Huawei",
  "model": "SUN2000-12KTL-M2",
  "controllable": false,
  "timestamp": 1755701251122,
  "read_time_ms": 42,
  "last_seen": 1755701251122,
  "status": "generating",
  "data_quality": 0.98,
  "W": -1800,
  "rated_power_W": 12000,
  "total_generation_Wh": 95000,
  "mppt1_V": 400,
  "mppt1_A": -3.75,
  "mppt2_V": 380,
  "mppt2_A": -3.68,
  "heatsink_C": 45,
  "optimization_fields": {
    "max_power_mw": 0.012,
    "efficiency_pct": 96
  },
  "configuration": {
    "firmware_version": "v2.3.1",
    "protocol": "ModbusTCP",
    "sunspec_model_id": 701,
    "installation_date": 1700000000000,
    "orientation_deg": 180,
    "tilt_deg": 30
  },
  "standards_compliance": {
    "ieee_1547_category": "A",
    "iec_61850_node": "DPVC"
  }
}
```

#### Generator-Specific Fields

| Field                 | Unit | Data Type | Description                                    |
| --------------------- | ---- | --------- | ---------------------------------------------- |
| `W`                   | W    | float     | Current power generation (always negative)     |
| `rated_power_W`       | W    | float     | Maximum rated power output                     |
| `total_generation_Wh` | Wh   | integer   | Cumulative energy generated                    |

#### Technology-Specific Fields (PV)

| Field         | Unit | Data Type | Description               |
| ------------- | ---- | --------- | ------------------------- |
| `mppt1_V`     | V    | float     | MPPT1 string voltage      |
| `mppt1_A`     | A    | float     | MPPT1 string current      |
| `heatsink_C`  | °C   | float     | Inverter temperature      |

### Storage Data Model

Storage systems store and discharge electrical energy.

```json
{
  "serial": "TG123456789",
  "site_id": "site_abc123",
  "type": "storage",
  "subtype": "battery",
  "make": "Tesla",
  "model": "Powerwall2",
  "controllable": true,
  "timestamp": 1755701251122,
  "read_time_ms": 38,
  "last_seen": 1755701251122,
  "status": "charging",
  "data_quality": 0.99,
  "W": 500,
  "A": 10.5,
  "V": 48.2,
  "SoC_nom_fract": 0.75,
  "capacity_Wh": 13500,
  "total_charge_Wh": 8000,
  "total_discharge_Wh": 7200,
  "heatsink_C": 25,
  "optimization_fields": {
    "max_power_mw": 0.005,
    "efficiency_pct": 94,
    "capacity_mwh": 0.0135
  },
  "control": {
    "mode": "auto",
    "target_W": 0,
    "enabled": true,
    "last_command_ts": 1755701250000,
    "reserve_fract": 0.20
  },
  "configuration": {
    "firmware_version": "v1.50.1",
    "protocol": "Tesla_Gateway",
    "sunspec_model_id": 802,
    "max_charge_rate_W": 5000,
    "max_discharge_rate_W": 5000,
    "warranty_expiry": 1995360000000
  },
  "standards_compliance": {
    "ieee_1547_category": "A",
    "iec_61850_node": "ZBAT"
  }
}
```

#### Storage-Specific Fields

| Field                | Unit     | Data Type | Description                                    |
| -------------------- | -------- | --------- | ---------------------------------------------- |
| `W`                  | W        | float     | Active power (+ charging, - discharging)      |
| `SoC_nom_fract`      | fraction | float     | State of charge (0.0-1.0)                     |
| `capacity_Wh`        | Wh       | integer   | Total storage capacity                         |
| `total_charge_Wh`    | Wh       | integer   | Cumulative energy charged                      |
| `total_discharge_Wh` | Wh       | integer   | Cumulative energy discharged                   |

#### Control Fields (for controllable storage)

| Field              | Unit     | Data Type | Description                                    |
| ------------------ | -------- | --------- | ---------------------------------------------- |
| `mode`             | -        | string    | "auto", "manual", "grid_following"             |
| `target_W`         | W        | float     | Target power setpoint                          |
| `enabled`          | -        | boolean   | Device enabled/disabled                        |
| `last_command_ts`  | ms       | integer   | Last control command timestamp                 |
| `reserve_fract`    | fraction | float     | Minimum SoC reserve (0.0-1.0)                 |

### EV Battery Storage (V2G)

Electric vehicle batteries accessed through V2G interface:

```json
{
  "serial": "V2G_VW_ID4_001",
  "site_id": "site_abc123",
  "type": "storage",
  "subtype": "ev_battery",
  "make": "Volkswagen",
  "model": "ID.4",
  "controllable": true,
  "timestamp": 1755701251122,
  "read_time_ms": 42,
  "W": -3500,
  "SoC_nom_fract": 0.85,
  "capacity_Wh": 77000,
  "max_charge_rate_W": 11000,
  "max_discharge_rate_W": 3700,
  "vehicle_hint": "VW_ID4_77kWh",
  "total_charge_Wh": 125000,
  "total_discharge_Wh": 15000,
  "optimization_fields": {
    "max_power_mw": 0.011,
    "efficiency_pct": 92,
    "capacity_mwh": 0.077
  },
  "charge_events": {
    "matrix": [[1, 0, 1, 1], [0, 1, 0, 1], [1, 1, 0, 0]],
    "intervals": ["2024-01-15T14:00:00Z", "2024-01-15T15:00:00Z", "2024-01-15T16:00:00Z"],
    "description": "Binary availability matrix for V2G optimization"
  },
  "standards_compliance": {
    "ieee_1547_category": "B",
    "iec_61850_node": "ZBAT"
  }
}
```

#### EV-Specific Fields

| Field           | Unit | Data Type | Description                                    |
| --------------- | ---- | --------- | ---------------------------------------------- |
| `charge_events` | -    | object    | Binary availability matrix for V2G scheduling (Compatible with IEC 61850 ZEVN scheduling) |
| `vehicle_hint`  | -    | string    | Vehicle model identifier                       |

### Grid Interface Data Model

Grid interfaces measure electricity flow at the point of common coupling.

```json
{
  "serial": "KMP2023001542",
  "site_id": "site_abc123",
  "type": "grid_interface",
  "subtype": "smart_meter",
  "make": "Kamstrup",
  "model": "Omnipower",
  "controllable": false,
  "timestamp": 1755701251122,
  "read_time_ms": 55,
  "last_seen": 1755701251122,
  "status": "online",
  "data_quality": 0.99,
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
  "total_export_Wh": 18000,
  "tariff": {
    "structure": "time_of_use",
    "current_price_per_kwh": 0.15,
    "demand_charge_kw": 50,
    "connection_capacity_kw": 100
  },
  "standards_compliance": {
    "iec_61850_node": "MMXU",
    "sunspec_model_id": 803
  }
}
```

#### Grid Interface-Specific Fields

| Field             | Unit | Data Type | Description                                     |
| ----------------- | ---- | --------- | ----------------------------------------------- |
| `W`               | W    | float     | Total active power (+ import, - export)        |
| `Hz`              | Hz   | float     | Grid frequency                                  |
| `total_import_Wh` | Wh   | integer   | Cumulative energy imported                      |
| `total_export_Wh` | Wh   | integer   | Cumulative energy exported                      |

### Load Data Model

Loads consume electricity and may have controllable features.

```json
{
  "serial": "Q2DC2023001542",
  "site_id": "site_abc123",
  "type": "load",
  "subtype": "ev_charger",
  "make": "Wallbox",
  "model": "Quasar2",
  "controllable": true,
  "timestamp": 1755701251122,
  "read_time_ms": 45,
  "last_seen": 1755701251122,
  "status": "charging",
  "data_quality": 0.97,
  "W": 7400,
  "max_power_W": 11000,
  "total_consumption_Wh": 285000,
  "optimization_fields": {
    "max_power_mw": 0.011,
    "efficiency_pct": 95
  },
  "connected_vehicle": {
    "connected_ts": 1755690000000,
    "soc_fract": 0.35,
    "capacity_Wh": 77000,
    "target_soc_fract": 0.80,
    "departure_ts": 1755720000000,
    "vehicle_id": "anonymous_id4_001"
  },
  "configuration": {
    "firmware_version": "v3.2.1",
    "protocol": "OCPP2.0.1",
    "connector_type": "CCS",
    "phases": 3,
    "v2g_capable": true,
    "ocpp_compliance": {
      "smart_charging_profiles": true,
      "bidirectional_charging": true,
      "iso15118_support": true
    }
  },
  "standards_compliance": {
    "ieee_1547_category": "A",
    "iec_61850_node": "ZEVN"
  }
}
```

#### Load-Specific Fields

| Field                    | Unit | Data Type | Description                              |
| ------------------------ | ---- | --------- | ---------------------------------------- |
| `W`                      | W    | float     | Active power consumption (always positive) |
| `max_power_W`            | W    | float     | Maximum power consumption                |
| `total_consumption_Wh`   | Wh   | integer   | Cumulative energy consumed               |

## Units and Conventions

### Standard Units

All measurements use base SI units:

- **Power**: W (watts)
- **Energy**: Wh (watt-hours)  
- **Voltage**: V (volts)
- **Current**: A (amperes)
- **Frequency**: Hz (hertz)
- **Temperature**: °C (Celsius)
- **State of Charge**: fraction (0.0 = empty, 1.0 = full)
- **Time**: milliseconds (Unix epoch, UTC)

### Sign Conventions

Power flow direction follows physics conventions:

- **Generation**: Negative power (Generators: `W < 0`)
- **Consumption/Charging**: Positive power (Storage charging, loads: `W > 0`)
- **Discharging**: Negative power (Storage discharging: `W < 0`)
- **Grid Import**: Positive power (From grid to site: `W > 0`)
- **Grid Export**: Negative power (From site to grid: `W < 0`)

*Note: Energy totals (`total_*_Wh`) are always positive cumulative values.*

### Optimization Units

For integration with optimization tools, power is converted to MW:

- **max_power_mw**: `max_power_W / 1,000,000`
- **capacity_mwh**: `capacity_Wh / 1,000,000`

## Error Handling

### Device Error Structure

```json
{
  "error": {
    "code": "SENSOR_FAILURE",
    "message": "MPPT1 voltage reading out of range (450V > 400V max)",
    "timestamp": 1755701251122,
    "severity": "warning"
  }
}
```

### Error Fields

| Field       | Data Type | Description                                      |
| ----------- | --------- | ------------------------------------------------ |
| `code`      | string    | Error code ("SENSOR_FAILURE", "COMM_TIMEOUT", "OUT_OF_RANGE") |
| `message`   | string    | Human-readable error description                 |
| `timestamp` | integer   | When the error occurred (Unix ms, UTC)          |
| `severity`  | string    | Error level ("info", "warning", "error", "critical") |

### Status Values

| Status        | Description                                      |
| ------------- | ------------------------------------------------ |
| `online`      | Device responding normally                       |
| `offline`     | Device not communicating                         |
| `error`       | Device error condition                           |
| `maintenance` | Device in maintenance mode                       |
| `generating`  | Generator producing power                        |
| `charging`    | Storage charging                                 |
| `discharging` | Storage discharging                              |
| `idle`        | Device online but not active                     |

This data model structure provides a clean foundation for energy management, optimization, and monitoring while maintaining strict hierarchy and clear ownership through the wallet → site → DER relationship.

## Standards Compliance

Sourceful's data model aligns with key open standards for interoperability, avoiding vendor lock-in and enabling seamless integration with utilities, DER devices, and third-party systems.

### IEEE 1547-2020 (Interconnection and Interoperability)

DER interconnection requirements for safe grid connection and advanced inverter functions.

- **Performance Categories**: All controllable DERs (storage, loads) support Category A/B ride-through for voltage/frequency events
- **Field Mappings**:
  - `W` and `target_W`: Align with active power control (Clause 5)
  - `Hz`, `L1_V` etc. in grid_interface: Map to voltage/frequency monitoring (Clause 4)
  - Site `grid_connection.voltage_tolerance_pct`: Directly from 1547 voltage limits (±10%)
- **Learn More**: [IEEE 1547 Overview (NREL)](https://www.nrel.gov/grid/ieee-standard-1547/overview-distributed-energy-resource-interconnection)

### IEC 61850-7-420 (DER Information Models)

Global standard for DER data modeling using logical nodes with hierarchical object-oriented approach.

- **Logical Node Mappings**:
  - Generator (PV): DPVC node – `W` maps to DPVC.MX.ActW, `mppt1_V` to DPVC.MX.DCVolt1
  - Storage (Battery): ZBAT node – `SoC_nom_fract` maps to ZBAT.ST.Soc, `W` to ZBAT.MX.ChaW
  - Grid Interface: MMXU node – `Hz` maps to MMXU.MX.Hz, `L1_V` to MMXU.MX.PhV.phsA
  - Load (EV Charger): ZEVN node – `connected_vehicle.soc_fract` maps to ZEVN.ST.Soc
- **Hierarchy**: Wallet/Site/DER aligns with IEC's system/device/attribute structure
- **Learn More**: [IEC 61850 Overview](https://www.iec.ch/basecamp/iec-61850-standard-power-utility-automation)

### SunSpec Modbus (DER Data Specifications)

Open Modbus extensions for DER registers with 100+ vendor support and IEEE 1547 references.

- **Register Mappings**:
  - Common Model 1: `make`/`model` map to Mfr (ID 1), Mn (ID 2)
  - Inverter Model 701: `W` maps to W (ID 111), `Hz` to Hz (ID 116)
  - Battery Model 802: `SoC_nom_fract` maps to SoC (ID 10), `capacity_Wh` to ChaRteMax (ID 17)
  - Meter Model 803: `total_import_Wh` maps to TotWhImp (ID 204)
- **Protocol**: Supported in `configuration.protocol: "ModbusTCP"`
- **Learn More**: [SunSpec Modbus Specs](https://sunspec.org/sunspec-modbus/)

### OpenADR 2.0/3.0 (Demand Response)

Handles grid signals and demand response for DER optimization with dynamic pricing support.

- **Field Mappings**:
  - `grid_signal.price_per_kWh` maps to OpenADR Price events
  - `demand_response_active` responds to DR signals
  - V2G: `SetOptimizedSchedule` responds to OpenADR VTN commands
- **Events**: Site-level OpenADR event handling for portfolio optimization
- **Learn More**: [OpenADR Specification](https://www.openadr.org/specification)

### OCPP 2.0.1 (Open Charge Point Protocol)

EV charger standard with V2G support, referenced in IEC 63110.

- **Field Mappings**:
  - `connected_vehicle.soc_fract` maps to MeterValues.SoC
  - `charge_events` maps to SmartCharging schedules
  - `max_discharge_rate_W` maps to BidirectionalCharging capabilities
- **Protocol**: Supported in `configuration.protocol: "OCPP2.0.1"`
- **V2G Integration**: Seamless bidirectional energy flow management
- **Learn More**: [OCPP Protocols](https://openchargealliance.org/protocols/ocpp/ocpp-201/)

### IEEE 2030.5 (Smart Energy Profile)

- **Application**: IP-based communications for DER control and monitoring
- **Integration**: GraphQL subscriptions map to DERFunction for real-time control
- **Transport**: Optional protocol for advanced grid integration scenarios

### EPRI OpenDER (Simulation and Testing)

- **Validation**: Use OpenDER (GitHub) for simulating IEEE 1547 compliance
- **Testing**: Validate `W`, voltage, and frequency fields against 1547 requirements
- **Integration**: Recommended for Python utility testing and development