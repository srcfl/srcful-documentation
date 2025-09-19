---
sidebar_position: 3
slug: /developer/data-models
pagination_prev: null
---

# Data Models

Sourceful uses standardized data models for collecting and processing Distributed Energy Resources (DER) data. This document explains the structure, conventions, and field definitions used across the platform.

## Table of Contents

* [Overview](#overview)
* [Core Concepts](#core-concepts)
    * [Data Model Structure](#data-model-structure)
    * [Inheritance Model](#inheritance-model)
    * [Units and Conventions](#units-and-conventions)
* [Device Types](#device-types)
    * [Base Device Data](#base-device-data)
    * [Generator Data Model](#generator-data-model)
    * [Storage Data Model](#storage-data-model)
    * [Grid Interface Data Model](#grid-interface-data-model)
    * [Load Data Model](#load-data-model)
* [Time-Series Data and Forecasting](#time-series-data-and-forecasting)
* [Advanced Examples](#advanced-examples)
    * [Complete Site State](#complete-site-state)
    * [V2G Integration](#v2g-integration)
    * [DER Registration](#der-registration)
* [Energy-py-linear Integration](#energy-py-linear-integration)

## Overview

The Sourceful platform supports distributed energy resources organized by their primary energy function:

- **Generators**: Devices that produce electricity (PV systems, wind turbines, fuel cells, etc.)
- **Storage Systems**: Devices that store and discharge energy (home batteries, EV batteries, etc.)
- **Grid Interfaces**: Devices that measure and manage grid connections (smart meters, inverters)
- **Loads**: Devices that consume electricity (EV chargers, heat pumps, controllable loads)

Each device type shares common base fields while adding function-specific measurements and capabilities.

## Core Concepts

### Data Model Structure

All device data follows a hierarchical structure:

1. **Site Level**: Groups multiple devices at a physical location
2. **Device Level**: Individual DER units (inverters, batteries, meters)
3. **Field Level**: Specific measurements and properties

### Inheritance Model

All device types inherit from a common base structure (`BaseDeviceData`) and add device-specific fields:

```json
{
  "type": "generator",        // Device function type
  "subtype": "pv",           // Specific technology
  "make": "Deye",            // Manufacturer (optional)
  "timestamp": 1755701251122, // Reading timestamp
  "read_time_ms": 42,        // Time to complete reading
  "W": -1500                 // Function-specific field (power generation)
}
```

### Units and Conventions

#### Standard Units

All measurements use base SI units for consistency:

- **Power**: W (watts)
- **Energy**: Wh (watt-hours)  
- **Voltage**: V (volts)
- **Current**: A (amperes)
- **Frequency**: Hz (hertz)
- **Temperature**: °C (Celsius)
- **State of Charge**: fraction (0.0 = empty, 1.0 = full)
- **Time**: milliseconds (for timestamps)

#### Sign Conventions

Power flow direction is indicated by sign:

- **Generation**: Negative power (Generators: `W < 0`)
- **Consumption/Charging**: Positive power (Storage charging, loads: `W > 0`)
- **Discharging**: Negative power (Storage discharging: `W < 0`)
- **Grid Import**: Positive power (Grid interface importing: `W > 0`)
- **Grid Export**: Negative power (Grid interface exporting: `W < 0`)

*Note: Energy totals (`total_*_Wh`) are always positive cumulative values.*

## Device Types

Each device type represents a fundamental energy function and has specific fields for its measurements and capabilities.

### Base Device Data

Common fields shared by all device types:

| Field           | Unit         | Data Type | Description                                   |
| --------------- | ------------ | --------- | --------------------------------------------- |
| `type`          | -            | string    | Device function ("generator", "storage", "grid_interface", "load") |
| `subtype`       | -            | string    | Specific technology ("pv", "wind", "battery", "ev_charger", etc.) |
| `make`          | -            | string    | Manufacturer/brand name (optional)            |
| `model`         | -            | string    | Device model (optional)                       |
| `serial`        | -            | string    | Device serial number                          |
| `timestamp`     | milliseconds | integer   | Timestamp when reading was taken              |
| `read_time_ms`  | milliseconds | integer   | Time taken to complete the reading            |
| `last_seen`     | milliseconds | integer   | Last successful communication timestamp       |
| `status`        | -            | string    | Device status ("online", "offline", "error", "maintenance") |
| `data_quality`  | -            | float     | Data reliability score (0.0-1.0)             |

**Optimization-Compatible Fields:**

| Field           | Unit | Data Type | Description                                   |
| --------------- | ---- | --------- | --------------------------------------------- |
| `max_power_mw`  | MW   | float     | Maximum power capability (scaled from W)     |
| `efficiency_pct`| %    | float     | Operating efficiency (0-100, derived from efficiency_fract) |

*Note: These fields are derived at egress for optimization tools. Internally, Sourceful maintains SI base units (W, fraction) per Core Principle 4.*

**GraphQL Schema Requirements:**

For optimization-compatible devices, the GraphQL schema enforces these fields as non-nullable:

- **Generators**: `max_power_mw!` and `efficiency_pct!` are required for all generator types
- **Storage**: `max_power_mw!`, `efficiency_pct!`, and `capacity_mwh!` are required for all storage types; `charge_events!` is additionally required for "ev_battery" subtype
- **Loads**: `max_power_mw!` and `efficiency_pct!` are required for controllable load types (EV chargers, heat pumps)
- **Grid Interfaces**: `max_power_mw!` is required when the interface supports bidirectional power flow

This ensures optimization algorithms receive complete power and efficiency data for all energy assets.

**Enhanced Error Handling:**

```json
{
  "type": "generator",
  "subtype": "pv",
  "make": "Deye",
  "serial": "SUN2023041234",
  "timestamp": 1755701251122,
  "read_time_ms": 42,
  "last_seen": 1755701251122,
  "status": "online",
  "data_quality": 0.95,
  "W": -1500,
  "max_power_mw": 0.003,
  "efficiency_pct": 96,
  "error": null
}
```

**Example with Error Condition:**

```json
{
  "type": "generator",
  "subtype": "pv",
  "make": "Deye", 
  "serial": "SUN2023041234",
  "timestamp": 1755701251122,
  "read_time_ms": 120,
  "last_seen": 1755701251122,
  "status": "error",
  "data_quality": 0.3,
  "W": null,
  "error": {
    "code": "SENSOR_FAILURE",
    "message": "MPPT1 voltage reading out of range (450V > 400V max)",
    "timestamp": 1755701251122,
    "severity": "warning"
  }
}
```

**Error Field Structure:**

| Field       | Data Type | Description                                      |
| ----------- | --------- | ------------------------------------------------ |
| `code`      | string    | Error code ("SENSOR_FAILURE", "COMM_TIMEOUT", "OUT_OF_RANGE") |
| `message`   | string    | Human-readable error description                 |
| `timestamp` | integer   | When the error occurred                          |
| `severity`  | string    | Error level ("info", "warning", "error", "critical") |

### Generator Data Model

Generators produce electricity from various energy sources. This includes solar PV, wind turbines, fuel cells, and other generation technologies.

**Example (PV System):**

```json
{
  "type": "generator",
  "subtype": "pv",
  "make": "Deye",
  "model": "SUN-5K-SG03LP1-EU",
  "serial": "SUN2023041234",
  "timestamp": 1755701251122,
  "read_time_ms": 42,
  "last_seen": 1755701251122,
  "status": "online",
  "data_quality": 0.98,
  "W": -1500,
  "rated_power_W": 3000,
  "max_power_mw": 0.003,
  "efficiency_pct": 96,
  "mppt1_V": 400,
  "mppt1_A": -3.75,
  "mppt2_V": 380,
  "mppt2_A": -3.68,
  "heatsink_C": 45,
  "total_generation_Wh": 15000,
  "configuration": {
    "firmware_version": "v2.3.1",
    "protocol": "ModbusTCP",
    "installation_date": 1700000000000,
    "orientation_deg": 180,
    "tilt_deg": 30,
    "location": {
      "latitude": 59.3293,
      "longitude": 18.0686
    }
  },
  "error": null
}
```

**Example (Wind Turbine):**

```json
{
  "type": "generator",
  "subtype": "wind",
  "make": "Vestas",
  "timestamp": 1755701251122,
  "read_time_ms": 38,
  "W": -2200,
  "rated_power_W": 5000,
  "wind_speed_ms": 8.5,
  "rotor_rpm": 45,
  "nacelle_C": 35,
  "total_generation_Wh": 45000
}
```

**Generator-Specific Fields:**

| Field                 | Unit | Data Type | Description                                    |
| --------------------- | ---- | --------- | ---------------------------------------------- |
| `W`                   | W    | float     | Current power generation (always negative)     |
| `rated_power_W`       | W    | float     | Maximum rated power output                     |
| `total_generation_Wh` | Wh   | integer   | Cumulative energy generated                    |

**Technology-Specific Fields (PV):**

| Field         | Unit | Data Type | Description               |
| ------------- | ---- | --------- | ------------------------- |
| `mppt1_V`     | V    | float     | MPPT1 string voltage      |
| `mppt1_A`     | A    | float     | MPPT1 string current      |
| `heatsink_C`  | °C   | float     | Inverter temperature      |

**Technology-Specific Fields (Wind):**

| Field           | Unit | Data Type | Description              |
| --------------- | ---- | --------- | ------------------------ |
| `wind_speed_ms` | m/s  | float     | Wind speed               |
| `rotor_rpm`     | rpm  | integer   | Rotor rotation speed     |
| `nacelle_C`     | °C   | float     | Nacelle temperature      |

### Storage Data Model

Storage systems store and discharge electrical energy. This includes home batteries, EV batteries, and other energy storage technologies.

**Example (Home Battery):**

```json
{
  "type": "storage",
  "subtype": "battery",
  "make": "Tesla",
  "model": "Powerwall2",
  "serial": "TG123456789",
  "timestamp": 1755701251122,
  "read_time_ms": 38,
  "last_seen": 1755701251122,
  "status": "online",
  "data_quality": 0.99,
  "W": 500,
  "A": 10.5,
  "V": 48.2,
  "SoC_nom_fract": 0.75,
  "capacity_Wh": 13500,
  "max_power_mw": 0.005,
  "efficiency_pct": 94,
  "heatsink_C": 25,
  "total_charge_Wh": 8000,
  "total_discharge_Wh": 7200,
  "configuration": {
    "firmware_version": "v1.50.1",
    "protocol": "Tesla_Gateway",
    "installation_date": 1680000000000,
    "warranty_expiry": 1995360000000,
    "max_charge_rate_W": 5000,
    "max_discharge_rate_W": 5000
  },
  "control": {
    "mode": "auto",
    "target_W": 0,
    "enabled": true,
    "last_command_ts": 1755701250000,
    "reserve_fract": 0.20
  },
  "error": null
}
```

**Example (EV Battery via V2G):**

```json
{
  "type": "storage",
  "subtype": "ev_battery",
  "make": "Volkswagen",
  "timestamp": 1755701251122,
  "read_time_ms": 42,
  "W": -3500,
  "SoC_nom_fract": 0.85,
  "capacity_Wh": 77000,
  "capacity_mwh": 0.077,
  "max_power_mw": 0.011,
  "efficiency_pct": 92,
  "max_charge_rate_W": 11000,
  "max_discharge_rate_W": 3700,
  "vehicle_hint": "VW_ID4_77kWh",
  "total_charge_Wh": 125000,
  "total_discharge_Wh": 15000,
  "charge_events": {
    "matrix": [[1, 0, 1, 1], [0, 1, 0, 1], [1, 1, 0, 0]],
    "intervals": ["2024-01-15T14:00:00Z", "2024-01-15T15:00:00Z", "2024-01-15T16:00:00Z"],
    "description": "Binary availability matrix for V2G optimization"
  }
}
```

**Storage-Specific Fields:**

| Field                | Unit     | Data Type | Description                                    |
| -------------------- | -------- | --------- | ---------------------------------------------- |
| `W`                  | W        | float     | Active power (+ charging, - discharging)      |
| `SoC_nom_fract`      | fraction | float     | State of charge (0.0-1.0)                     |
| `capacity_Wh`        | Wh       | integer   | Total storage capacity                         |
| `total_charge_Wh`    | Wh       | integer   | Cumulative energy charged                      |
| `total_discharge_Wh` | Wh       | integer   | Cumulative energy discharged                   |

**EV-Specific Fields (for V2G optimization):**

| Field           | Unit | Data Type | Description                                    |
| --------------- | ---- | --------- | ---------------------------------------------- |
| `charge_events` | -    | object    | Binary availability matrix for V2G scheduling |

**Charge Events Structure (for ev_battery subtype):**

The `charge_events` field provides a binary matrix indicating EV availability for V2G optimization:

| Field        | Data Type | Description                                    |
| ------------ | --------- | ---------------------------------------------- |
| `matrix`     | array     | Binary matrix [intervals x events] (1=available, 0=unavailable) |
| `intervals`  | array     | ISO-8601 timestamps for each matrix row       |
| `description`| string    | Human-readable explanation of matrix structure |

*Note: For storage devices with subtype "ev_battery", the charge_events matrix is critical for V2G optimization in energy-py-linear. It indicates when the vehicle is connected and available for charging/discharging operations.*

**Control Fields (for controllable storage):**

| Field              | Unit     | Data Type | Description                                    |
| ------------------ | -------- | --------- | ---------------------------------------------- |
| `mode`             | -        | string    | Control mode ("auto", "manual", "grid_following") |
| `target_W`         | W        | float     | Target power setpoint                          |
| `enabled`          | -        | boolean   | Device enabled/disabled status                 |
| `last_command_ts`  | ms       | integer   | Timestamp of last control command             |
| `reserve_fract`    | fraction | float     | Minimum SoC reserve (0.0-1.0)                |

**Control Commands via GraphQL:**

```graphql
mutation SetStorageControl($input: StorageControlInput!) {
  setStorageControl(input: $input) {
    success
    derSerial
    control {
      mode
      target_W
      enabled
      reserve_fract
    }
  }
}
```

**Variables:**

```json
{
  "input": {
    "walletId": "wallet_xyz789",
    "siteId": "site_abc123", 
    "derSerial": "TG123456789",
    "control": {
      "mode": "manual",
      "target_W": -2000,
      "enabled": true,
      "reserve_fract": 0.20
    }
  }
}
```

### Grid Interface Data Model

Grid interfaces measure and manage electricity flow at connection points. This includes smart meters, grid-tie inverters, and other grid interconnection devices.

**Example (Smart Meter):**

```json
{
  "type": "grid_interface",
  "subtype": "smart_meter",
  "make": "Kamstrup",
  "model": "Omnipower",
  "serial": "KMP2023001542",
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
  "electricity_prices": [0.15, 0.12, 0.18, 0.14],
  "high_temperature_load_mwh": [0.01, 0.02, 0.01, 0.015],
  "low_temperature_load_mwh": [0.005, 0.007, 0.006, 0.008],
  "price_forecast": {
    "timestamp": 1755701251100,
    "horizon_hours": 24,
    "prices_per_kwh": [0.15, 0.12, 0.18, 0.14, 0.16],
    "confidence": [0.95, 0.93, 0.88, 0.90, 0.85]
  },
  "configuration": {
    "tariff_structure": "time_of_use",
    "demand_charge_kw": 50,
    "connection_capacity_kw": 100,
    "market_participant_id": "NORD_POOL_12345"
  },
  "error": null
}
```

**Grid Interface-Specific Fields:**

| Field             | Unit | Data Type | Description                                     |
| ----------------- | ---- | --------- | ----------------------------------------------- |
| `W`               | W    | float     | Total active power (+ import, - export)        |
| `Hz`              | Hz   | float     | Grid frequency                                  |
| `total_import_Wh` | Wh   | integer   | Cumulative energy imported from grid            |
| `total_export_Wh` | Wh   | integer   | Cumulative energy exported to grid              |

**Optimization-Specific Fields:**

| Field                      | Unit     | Data Type | Description                                     |
| -------------------------- | -------- | --------- | ----------------------------------------------- |
| `electricity_prices`       | $/kWh    | array     | Time-series electricity prices for optimization |
| `high_temperature_load_mwh`| MWh      | array     | Thermal load data (heating) - optional         |
| `low_temperature_load_mwh` | MWh      | array     | Thermal load data (cooling) - optional         |

**Price Forecast Structure:**

| Field            | Unit     | Data Type | Description                                     |
| ---------------- | -------- | --------- | ----------------------------------------------- |
| `prices_per_kwh` | $/kWh    | array     | Forecasted prices for optimization horizon     |
| `confidence`     | fraction | array     | Confidence levels for each price forecast      |
| `horizon_hours`  | hours    | integer   | Forecast time horizon                           |

*Note: Price arrays must align with time intervals. Array length validation ensures determinism per Core Principle 5.*

### Load Data Model

Loads consume electricity and may have controllable or smart features. This includes EV chargers, heat pumps, and other controllable loads.

**Example (EV Charger):**

```json
{
  "type": "load",
  "subtype": "ev_charger",
  "make": "Wallbox",
  "model": "Quasar2",
  "serial": "Q2DC2023001542",
  "timestamp": 1755701251122,
  "read_time_ms": 45,
  "last_seen": 1755701251122,
  "status": "online",
  "data_quality": 0.97,
  "W": 7400,
  "max_power_W": 11000,
  "max_power_mw": 0.011,
  "efficiency_pct": 95,
  "total_consumption_Wh": 285000,
  "connected_vehicle": {
    "connected_ts": 1755690000000,
    "soc_fract": 0.35,
    "capacity_Wh": 77000,
    "capacity_mwh": 0.077,
    "target_soc_fract": 0.80,
    "departure_ts": 1755720000000,
    "vehicle_id": "anonymous_id4_001",
    "charge_events": {
      "matrix": [[1, 0, 1, 1], [0, 1, 0, 1], [1, 1, 0, 0]],
      "intervals": ["2024-01-15T14:00:00Z", "2024-01-15T15:00:00Z", "2024-01-15T16:00:00Z"],
      "description": "Binary availability matrix for optimization (intervals x charging sessions)"
    }
  },
  "configuration": {
    "firmware_version": "v3.2.1",
    "protocol": "OCPP2.0.1",
    "installation_date": 1700000000000,
    "connector_type": "CCS",
    "phases": 3,
    "v2g_capable": true
  },
  "error": null
}
```

**Load-Specific Fields:**

| Field                    | Unit     | Data Type | Description                              |
| ------------------------ | -------- | --------- | ---------------------------------------- |
| `W`                      | W        | float     | Active power consumption (always positive) |
| `max_power_W`            | W        | float     | Maximum power consumption                |
| `max_power_mw`           | MW       | float     | Maximum power in MW (max_power_W / 1e6)  |
| `efficiency_pct`         | %        | float     | Charging efficiency (0-100)             |
| `total_consumption_Wh`   | Wh       | integer   | Cumulative energy consumed               |

**EV-Specific Fields (for optimization):**

| Field              | Unit | Data Type | Description                                    |
| ------------------ | ---- | --------- | ---------------------------------------------- |
| `capacity_mwh`     | MWh  | float     | Vehicle battery capacity (capacity_Wh / 1e6)   |
| `charge_events`    | -    | object    | Binary matrix for optimization scheduling      |

**Charge Events Structure:**

The `charge_events` field provides a binary matrix indicating EV availability for optimization algorithms:

| Field        | Data Type | Description                                    |
| ------------ | --------- | ---------------------------------------------- |
| `matrix`     | array     | Binary matrix [intervals x events] (1=available, 0=unavailable) |
| `intervals`  | array     | ISO-8601 timestamps for each matrix row       |
| `description`| string    | Human-readable explanation of matrix structure |

*Note: The charge_events matrix is generated from connected_ts and departure_ts, aligned with Sourceful's time authority (Core Principle 6).*

## Time-Series Data and Forecasting

### Historical Data Queries

The GraphQL API supports flexible time-series queries with aggregation and downsampling:

```graphql
query GetDERHistory($walletId: ID!, $siteId: ID!, $derSerial: String!, $startTs: Long!, $endTs: Long!, $interval: String!) {
  wallet(id: $walletId) {
    site(id: $siteId) {
      der(serial: $derSerial) {
        history(startTs: $startTs, endTs: $endTs, interval: $interval) {
          timestamp
          W
          status
          socFract
          dataQuality
        }
        forecast(horizon: 24) {
          timestamp
          predictedW
          confidence
          weatherContext {
            solarIrradianceWm2
            temperatureC
            windSpeedMs
          }
        }
      }
    }
  }
}
```

### Site-Level Optimization Query

For energy-py-linear integration, use this query to export time-series data aggregated to hourly intervals:

```graphql
query GetSiteHistory($walletId: ID!, $siteId: ID!, $startTs: Long!, $endTs: Long!, $interval: String! = "1h") {
  wallet(id: $walletId) {
    site(id: $siteId) {
      history(startTs: $startTs, endTs: $endTs, interval: $interval) {
        timestamp
        electricity_prices
        high_temperature_load_mwh
        low_temperature_load_mwh
        derSummary {
          generator { 
            W
            count
            max_power_mw
            efficiency_pct
          }
          storage { 
            W
            avgSocFract
            capacity_mwh
            max_power_mw
            efficiency_pct
          }
          load { 
            W
            active
            max_power_mw
            efficiency_pct
          }
        }
        weather {
          temperatureC
          solarIrradianceWm2
          windSpeedMs
          cloudCoverFract
        }
        gridSignal {
          pricePerKwh
          demandResponseActive
          carbonIntensityGCO2Kwh
        }
      }
      ders {
        serial
        type
        subtype
        history(startTs: $startTs, endTs: $endTs, interval: $interval) {
          timestamp
          W
          socFract
          chargeEvents {
            matrix
            intervals
          }
        }
      }
    }
  }
}
```

**Query Parameters:**

| Parameter  | Type   | Description                               |
| ---------- | ------ | ----------------------------------------- |
| `startTs`  | Long   | Start timestamp (Unix ms, UTC)           |
| `endTs`    | Long   | End timestamp (Unix ms, UTC)             |
| `interval` | String | Aggregation interval ("1h", "15min", etc.) |

*Note: All timestamps follow Sourceful's time authority (Core Principle 6). Aggregation respects site boundary energy conservation (Core Principle 5).*

**Supported Intervals:**
- `"1min"` - 1-minute resolution (kept for 7 days)
- `"5min"` - 5-minute resolution (kept for 30 days)  
- `"1hour"` - Hourly resolution (kept for 1 year)
- `"1day"` - Daily aggregates (kept for 5 years)

### Forecasting Data Structure

```json
{
  "forecast": {
    "timestamp": 1755701251122,
    "horizon_hours": 24,
    "predicted_W": [-1200, -1500, -1000, -800],
    "confidence": [0.85, 0.82, 0.78, 0.75],
    "weather_context": {
      "solar_irradiance_Wm2": [800, 900, 950, 820],
      "temperature_C": [22, 25, 28, 26],
      "cloud_cover_fract": [0.2, 0.1, 0.1, 0.3]
    },
    "model_version": "v2.1.3",
    "last_updated_ts": 1755701200000
  }
}
```

## Advanced Examples

This section provides complete examples of complex site configurations and advanced features like V2G integration.

### GraphQL API Structure

The Sourceful platform uses GraphQL for all API interactions, providing flexible querying capabilities with a hierarchical structure:

**Wallet → Site → DER Hierarchy:**

- **Wallet Level**: Top-level container for all user assets
- **Site Level**: Physical locations with multiple DER devices  
- **DER Level**: Individual devices (PV, battery, meters, V2G chargers)

**Flexible Query Patterns:**

The GraphQL API allows you to query at any level and fetch exactly the data you need:

1. **Top-down**: Start with a wallet and drill down to specific sites/DERs
2. **Direct access**: Query a specific site or DER directly with context
3. **Aggregated views**: Get summaries at wallet or site level
4. **Real-time updates**: Subscribe to live data streams

This eliminates the need for multiple REST API calls and allows clients to fetch complete data sets in a single request.

### Complete Site State

A complete site state shows how multiple DER devices are organized and reported together, including environmental context and grid signals:

```json
{
  "site_id": "site_abc123",
  "wallet_id": "wallet_xyz789",
  
  "energy_balance": {
    "timestamp": 1755701251122,
    "interval_ms": 1000,
    
    "pcc_total": {
      "W": 1200,
      "total_import_Wh": 450000,
      "total_export_Wh": 125000
    },
    
    "der_summary": {
      "generator": {
        "W": -2800,
        "count": 2,
        "last_seen": 1755701251100
      },
      "storage": {
        "W": 500,
        "count": 1,
        "avg_soc_fract": 0.45,
        "last_seen": 1755701251050
      },
      "load": {
        "W": 7400,
        "count": 3,
        "active": 2,
        "last_seen": 1755701251122
      }
    },
    
    "load": {
      "W": -3900,
      "calculation": "derived"
    }
  },

  "context": {
    "weather": {
      "timestamp": 1755701251100,
      "temperature_C": 22.5,
      "solar_irradiance_Wm2": 800,
      "wind_speed_ms": 5.5,
      "cloud_cover_fract": 0.2,
      "humidity_fract": 0.65,
      "pressure_hPa": 1013.25
    },
    "grid_signal": {
      "timestamp": 1755701250000,
      "price_per_kWh": 0.15,
      "demand_response_active": false,
      "grid_frequency_Hz": 50.02,
      "grid_stability": "normal",
      "peak_demand_warning": false,
      "carbon_intensity_gCO2_kWh": 250
    },
    "location": {
      "timezone": "Europe/Stockholm",
      "latitude": 59.3293,
      "longitude": 18.0686,
      "elevation_m": 25
    }
  },
  
  "der_details": {
    "generator": {
      "SUN2000-12KTL-M2_SN2023041234": {
        "type": "generator",
        "subtype": "pv", 
        "W": -1800,
        "make": "Huawei",
        "model": "SUN2000-12KTL-M2",
        "serial": "SN2023041234",
        "total_generation_Wh": 95000,
        "last_seen": 1755701251100,
        "status": "generating",
        "max_power_mw": 0.012,
        "efficiency_pct": 96
      },
      "SE6000H_7E051B2A": {
        "type": "generator",
        "subtype": "pv",
        "W": -1000,
        "make": "SolarEdge",
        "model": "SE6000H",
        "serial": "7E051B2A",
        "total_generation_Wh": 62000,
        "last_seen": 1755701251100,
        "status": "generating",
        "max_power_mw": 0.006,
        "efficiency_pct": 95
      }
    },
    
    "storage": {
      "PW2_TG123456789": {
        "type": "storage",
        "subtype": "battery",
        "W": 500,
        "make": "Tesla",
        "model": "Powerwall2",
        "serial": "TG123456789",
        "soc_fract": 0.45,
        "capacity_Wh": 13500,
        "capacity_mwh": 0.0135,
        "max_power_mw": 0.005,
        "efficiency_pct": 94,
        "total_charge_Wh": 180000,
        "total_discharge_Wh": 175000,
        "last_seen": 1755701251050,
        "status": "charging"
      }
    },
    
    "load": {
      "WALLBOX_Q2DC2023001542": {
        "type": "load",
        "subtype": "ev_charger",
        "W": 7400,
        "make": "Wallbox",
        "model": "Quasar2",
        "serial": "Q2DC2023001542",
        "max_power_W": 11000,
        "max_power_mw": 0.011,
        "efficiency_pct": 95,
        "last_seen": 1755701251122,
        "status": "charging",
        "connected_vehicle": {
          "connected_ts": 1755690000000,
          "soc_fract": 0.35,
          "capacity_Wh": 77000,
          "capacity_mwh": 0.077,
          "target_soc_fract": 0.80,
          "departure_ts": 1755720000000,
          "vehicle_id": "anonymous_id4_001"
        }
      }
    }
  }
}
```

### V2G Integration

Vehicle-to-Grid (V2G) systems allow electric vehicles to both charge from and discharge to the grid.

#### DER Registration

When a new V2G charger is installed, use a GraphQL mutation:

```graphql
mutation RegisterDER($input: RegisterDERInput!) {
  registerDER(input: $input) {
    success
    der {
      serial
      type
      make
      model
      capabilities {
        maxChargeW
        maxDischargeW
        supportsV2G
        connectorType
        phases
      }
      installation {
        timestamp
        location
        gridConnection
      }
    }
  }
}
```

**Variables:**

```json
{
  "input": {
    "siteId": "site_abc123", 
    "der": {
      "type": "load",
      "subtype": "ev_charger",
      "serial": "Q2DC2023001542",
      "make": "Wallbox",
      "model": "Quasar2",
      "capabilities": {
        "maxChargeW": 11000,
        "maxDischargeW": 11000,
        "supportsV2G": true,
        "connectorType": "CCS",
        "phases": 3
      },
      "installation": {
        "timestamp": 1700000000000,
        "location": "parking_spot_01",
        "gridConnection": "phase_balanced"
      }
    }
  }
}
```

#### Vehicle Connection Event

When a vehicle connects to a V2G charger, this can be handled via GraphQL mutation or subscription:

**Mutation to record vehicle connection:**

```graphql
mutation VehicleConnected($input: VehicleConnectionInput!) {
  vehicleConnected(input: $input) {
    success
    session {
      id
      derSerial
      vehicleData {
        socFract
        capacityWh
        maxChargeRateW
        maxDischargeRateW
        vehicleHint
      }
      sessionParams {
        targetSocFract
        departureTs
        v2gEnabled
      }
    }
  }
}
```

**Variables:**

```json
{
  "input": {
    "timestamp": 1755690000000,
    "derSerial": "Q2DC2023001542",
    "vehicleData": {
      "socFract": 0.35,
      "capacityWh": 77000,
      "maxChargeRateW": 11000,
      "maxDischargeRateW": 3700,
      "vehicleHint": "VW_ID4_77kWh"
    },
    "sessionParams": {
      "targetSocFract": 0.80,
      "departureTs": 1755720000000,
      "v2gEnabled": true
    }
  }
}
```

**Subscription for real-time vehicle events:**

```graphql
subscription VehicleEvents($siteId: ID!) {
  vehicleEvents(siteId: $siteId) {
    event
    timestamp
    derSerial
    vehicleData {
      socFract
      capacityWh
    }
  }
}
```

### Optimization Feedback

#### Set Optimized Schedule

Import optimized schedules from energy-py-linear and apply as control commands:

```graphql
mutation SetOptimizedSchedule($input: OptimizationScheduleInput!) {
  setOptimizedSchedule(input: $input) {
    success
    siteId
    schedule {
      timestamp
      derSerial
      targetW
      mode
      validationErrors
    }
    energyBalance {
      projectedImportWh
      projectedExportWh
      conservationCheck
    }
  }
}
```

**Variables Example:**

```json
{
  "input": {
    "siteId": "site_abc123",
    "optimizationHorizonHours": 24,
    "schedule": [
      {
        "timestamp": 1755701251122,
        "derSerial": "PW2_TG123456789",
        "targetW": -2000,
        "mode": "discharge",
        "priority": 1
      },
      {
        "timestamp": 1755704851122,
        "derSerial": "Q2DC2023001542",
        "targetW": 7400,
        "mode": "charge",
        "priority": 2
      }
    ],
    "constraints": {
      "maxImportW": 50000,
      "maxExportW": -30000,
      "reserveRequirements": {
        "minBatterySocFract": 0.20,
        "emergencyReserveWh": 10000
      }
    }
  }
}
```

**Schedule Input Structure:**

| Field       | Unit | Data Type | Description                                    |
| ----------- | ---- | --------- | ---------------------------------------------- |
| `timestamp` | ms   | integer   | Setpoint activation time (Unix ms, UTC)       |
| `derSerial` | -    | string    | Target device serial number                    |
| `targetW`   | W    | float     | Target power (MW from energy-py-linear * 1e6) |
| `mode`      | -    | string    | Control mode ("charge", "discharge", "idle")  |
| `priority`  | -    | integer   | Execution priority (1=highest)                |

*Note: Power setpoints are validated against device max_power_mw constraints and site boundary limits per Core Principles 2 and 5.*

#### DER History Query

The GraphQL API provides flexible querying at any level of the hierarchy (wallet → site → DER):

**Query a specific DER with full context:**

```graphql
query GetDERDetails($walletId: ID!, $siteId: ID!, $derSerial: String!) {
  wallet(id: $walletId) {
    id
    site(id: $siteId) {
      id
      der(serial: $derSerial) {
        serial
        type
        make
        model
        currentState {
          W
          status
          lastSeen
          ... on V2GCharger {
            connectedVehicle {
              socFract
              targetSocFract
              departureTs
            }
          }
        }
        sessions(limit: 10) {
          startTs
          endTs
          vehicleId
          energyChargedWh
          energyDischargedWh
          maxPowerW
        }
        lifetimeStats {
          totalChargeWh
          totalDischargeWh
          totalSessions
          uptimeHours
        }
      }
    }
  }
}
```

**Query all DERs for a site:**

```graphql
query GetSiteDERs($walletId: ID!, $siteId: ID!) {
  wallet(id: $walletId) {
    site(id: $siteId) {
      id
      energyBalance {
        timestamp
        pccTotal {
          W
          totalImportWh
          totalExportWh
        }
        derSummary {
          generator { W, count, lastSeen }
          storage { W, count, avgSocFract, lastSeen }
          load { W, count, active, lastSeen }
        }
      }
      ders {
        serial
        type
        subtype
        make
        model
        currentState {
          W
          lastSeen
          status
        }
      }
    }
  }
}
```

**Query all sites and their DERs for a wallet (with pagination):**

```graphql
query GetWalletOverview($walletId: ID!, $first: Int, $after: String) {
  wallet(id: $walletId) {
    id
    sites(first: $first, after: $after) {
      edges {
        node {
          id
          energyBalance {
            pccTotal { W }
            derSummary {
              generator { W, count }
              storage { W, count, avgSocFract }
              load { W, count, active }
            }
          }
          context {
            weather {
              temperatureC
              solarIrradianceWm2
            }
            gridSignal {
              pricePerKwh
              demandResponseActive
            }
          }
          ders {
            serial
            type
            subtype
            make
            currentState {
              W
              status
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
        totalCount
      }
    }
  }
}
```

**Batch DER queries for efficiency:**

```graphql
query GetBatchDERs($walletId: ID!, $derSerials: [String!]!) {
  wallet(id: $walletId) {
    ders(serials: $derSerials) {
      serial
      type
      subtype
      currentState {
        W
        socFract
        status
        lastSeen
        dataQuality
      }
      error {
        code
        message
        severity
      }
    }
  }
}
```
```

This structure provides a comprehensive view of site energy flow, individual device performance, and advanced features like vehicle integration.

## Energy-py-linear Integration

### Python Utility for Optimization

The following utility demonstrates how to bridge Sourceful data to energy-py-linear for optimization:

```python
import energy_py_linear as epl
import pandas as pd
from graphql_client import GraphQLClient
from datetime import datetime, timedelta

class SourcefulOptimizer:
    def __init__(self, api_endpoint, auth_token):
        self.client = GraphQLClient(api_endpoint, headers={"Authorization": f"Bearer {auth_token}"})
    
    def export_site_data(self, wallet_id, site_id, start_time, end_time):
        """Export Sourceful data to energy-py-linear format"""
        query = """
        query GetSiteHistory($walletId: ID!, $siteId: ID!, $startTs: Long!, $endTs: Long!, $interval: String!) {
          wallet(id: $walletId) {
            site(id: $siteId) {
              history(startTs: $startTs, endTs: $endTs, interval: $interval) {
                timestamp
                electricity_prices
                high_temperature_load_mwh
                low_temperature_load_mwh
                derSummary {
                  generator { W, max_power_mw, efficiency_pct }
                  storage { W, avgSocFract, capacity_mwh, max_power_mw, efficiency_pct }
                  load { W, max_power_mw, efficiency_pct }
                }
              }
              ders {
                serial
                type
                subtype
                configuration { max_charge_rate_W, max_discharge_rate_W }
                history(startTs: $startTs, endTs: $endTs, interval: $interval) {
                  timestamp
                  W
                  socFract
                  chargeEvents { matrix }
                }
              }
            }
          }
        }
        """
        
        variables = {
            "walletId": wallet_id,
            "siteId": site_id, 
            "startTs": int(start_time.timestamp() * 1000),
            "endTs": int(end_time.timestamp() * 1000),
            "interval": "1h"
        }
        
        return self.client.execute(query, variables)
    
    def create_energy_py_assets(self, site_data):
        """Transform Sourceful data to energy-py-linear assets"""
        assets = []
        site_history = site_data['wallet']['site']['history']
        ders = site_data['wallet']['site']['ders']
        
        # Create Battery assets
        for der in ders:
            if der['type'] == 'storage' and der['subtype'] == 'battery':
                config = der['configuration']
                battery = epl.Battery(
                    power_mw=config['max_charge_rate_W'] / 1e6,  # W → MW
                    capacity_mwh=config['capacity_Wh'] / 1e6,    # Wh → MWh
                    efficiency_pct=config.get('efficiency_pct', 90)
                )
                assets.append(battery)
        
        # Create RenewableGenerator assets (PV)
        for der in ders:
            if der['type'] == 'generator' and der['subtype'] == 'pv':
                # Extract generation profile from history
                generation_mw = [h['W'] / 1e6 for h in der['history']]  # W → MW
                pv = epl.RenewableGenerator(
                    electricity_generation_mwh=generation_mw,
                    name=f"PV_{der['serial']}"
                )
                assets.append(pv)
        
        # Create EV assets
        for der in ders:
            if der['type'] == 'load' and der['subtype'] == 'ev_charger':
                if any(h.get('chargeEvents') for h in der['history']):
                    charge_events = [h['chargeEvents']['matrix'] for h in der['history'] if h.get('chargeEvents')]
                    ev = epl.EVs(
                        charge_events=charge_events[0] if charge_events else [[1] * 24],
                        charger_power_mw=der['max_power_mw'],
                        battery_capacity_mwh=0.077,  # Example EV capacity
                        charge_efficiency_pct=95
                    )
                    assets.append(ev)
        
        return assets
    
    def optimize_site(self, wallet_id, site_id, start_time, end_time):
        """Run optimization and return results"""
        # Export data from Sourceful
        site_data = self.export_site_data(wallet_id, site_id, start_time, end_time)
        
        # Transform to energy-py-linear format
        assets = self.create_energy_py_assets(site_data)
        
        # Extract price data ($/kWh → $/MWh)
        electricity_prices = [p * 1000 for p in site_data['wallet']['site']['history']['electricity_prices']]
        
        # Create site and optimize
        site = epl.Site(
            assets=assets,
            electricity_prices=electricity_prices,
            high_temperature_load_mwh=site_data['wallet']['site']['history'].get('high_temperature_load_mwh', []),
            low_temperature_load_mwh=site_data['wallet']['site']['history'].get('low_temperature_load_mwh', [])
        )
        
        results = site.optimize(objective="profit")
        return results
    
    def apply_optimization_results(self, wallet_id, site_id, optimization_results):
        """Send optimized schedule back to Sourceful"""
        schedule = []
        
        # Transform energy-py-linear results to Sourceful format
        for asset_name, asset_results in optimization_results.items():
            if 'charge_mw' in asset_results:
                for i, power_mw in enumerate(asset_results['charge_mw']):
                    schedule.append({
                        "timestamp": int((datetime.now() + timedelta(hours=i)).timestamp() * 1000),
                        "derSerial": asset_name,
                        "targetW": power_mw * 1e6,  # MW → W
                        "mode": "charge" if power_mw > 0 else "discharge",
                        "priority": 1
                    })
        
        mutation = """
        mutation SetOptimizedSchedule($input: OptimizationScheduleInput!) {
          setOptimizedSchedule(input: $input) {
            success
            siteId
            schedule { timestamp, derSerial, targetW, mode }
          }
        }
        """
        
        variables = {
            "input": {
                "siteId": site_id,
                "schedule": schedule,
                "optimizationHorizonHours": 24
            }
        }
        
        return self.client.execute(mutation, variables)

# Usage example
optimizer = SourcefulOptimizer("https://api.sourceful.energy/graphql", "your_auth_token")

# Run optimization for the next 24 hours
start_time = datetime.now()
end_time = start_time + timedelta(hours=24)

results = optimizer.optimize_site("wallet_xyz789", "site_abc123", start_time, end_time)
response = optimizer.apply_optimization_results("wallet_xyz789", "site_abc123", results)

print(f"Optimization applied: {response['setOptimizedSchedule']['success']}")
```

### Key Integration Points

1. **Unit Conversions**: W ↔ MW, Wh ↔ MWh, $/kWh ↔ $/MWh
2. **Time Authority**: Sourceful timestamps are preserved throughout (Core Principle 6)
3. **Site Boundary**: All optimization respects the PCC boundary (Core Principle 2)
4. **Energy Conservation**: Setpoints are validated against physics constraints (Core Principle 5)
5. **Determinism**: All transformations are reversible and deterministic (Core Principle 5)

This utility enables seamless integration between Sourceful's real-time DER data and energy-py-linear's optimization algorithms while maintaining compliance with Core Principles.