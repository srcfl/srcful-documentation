---
sidebar_position: 4
slug: /developer/graphql-api
pagination_prev: null
---

# GraphQL API

The Sourceful platform uses GraphQL for all API interactions, providing flexible querying capabilities with a hierarchical structure following the wallet → site → DER model.

## Table of Contents

* [API Structure](#api-structure)
* [Authentication](#authentication)
* [Core Queries](#core-queries)
* [Mutations](#mutations)
* [Subscriptions](#subscriptions)
* [Time-Series Data](#time-series-data)
* [Optimization Integration](#optimization-integration)
* [Error Handling](#error-handling)

## API Structure

### Hierarchical Access Pattern

The GraphQL API follows a strict hierarchy that mirrors the data ownership model:

**Wallet → Site → DER**

- **Wallet Level**: Top-level container for all user assets
- **Site Level**: Physical locations with multiple DER devices  
- **DER Level**: Individual devices (PV, battery, meters, V2G chargers)

### Flexible Query Patterns

1. **Top-down**: Start with a wallet and drill down to specific sites/DERs
2. **Direct access**: Query a specific site or DER directly with context
3. **Aggregated views**: Get summaries at wallet or site level
4. **Real-time updates**: Subscribe to live data streams

This eliminates the need for multiple REST API calls and allows clients to fetch complete data sets in a single request.

## Authentication

All GraphQL requests require authentication via Bearer token:

```http
POST /graphql
Authorization: Bearer your_auth_token
Content-Type: application/json
```

## Core Queries

### Wallet Overview

Query all sites and their DERs for a wallet (with pagination):

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

### Site Details

Query all DERs for a specific site:

```graphql
query GetSiteDERs($walletId: ID!, $siteId: ID!) {
  wallet(id: $walletId) {
    site(id: $siteId) {
      id
      specifications {
        ampFuseSize
        phaseConfiguration
        voltage
        gridRegion
        dsoCode
      }
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
        controllable
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

### DER Details

Query a specific DER with full context:

```graphql
query GetDERDetails($walletId: ID!, $siteId: ID!, $derSerial: String!) {
  wallet(id: $walletId) {
    site(id: $siteId) {
      id
      der(serial: $derSerial) {
        serial
        type
        make
        model
        controllable
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

### Batch DER Queries

Query multiple DERs efficiently:

```graphql
query GetBatchDERs($walletId: ID!, $derSerials: [String!]!) {
  wallet(id: $walletId) {
    ders(serials: $derSerials) {
      serial
      type
      subtype
      controllable
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

## Mutations

### DER Registration

Register a new DER device:

```graphql
mutation RegisterDER($input: RegisterDERInput!) {
  registerDER(input: $input) {
    success
    der {
      serial
      type
      make
      model
      controllable
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
      "controllable": true,
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

### Storage Control

Set control parameters for storage devices:

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

### Vehicle Connection

Record vehicle connection to V2G charger:

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

## Subscriptions

### Real-time Vehicle Events

Subscribe to vehicle connection/disconnection events:

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

### Live Data Streams

Subscribe to real-time DER data updates:

```graphql
subscription DERLiveData($walletId: ID!, $siteId: ID!) {
  derLiveData(walletId: $walletId, siteId: $siteId) {
    derSerial
    timestamp
    W
    status
    ... on StorageData {
      socFract
    }
  }
}
```

## Time-Series Data

### Historical Data Queries

Query time-series data with flexible aggregation:

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

### Site-Level History

Query aggregated site history for optimization:

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

**Supported Intervals:**
- `"1min"` - 1-minute resolution (kept for 7 days)
- `"5min"` - 5-minute resolution (kept for 30 days)  
- `"1hour"` - Hourly resolution (kept for 1 year)
- `"1day"` - Daily aggregates (kept for 5 years)

## Optimization Integration

### Set Optimized Schedule

Import optimized schedules from energy-py-linear:

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

**Variables:**

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

## Error Handling

### GraphQL Error Format

Errors follow the GraphQL specification:

```json
{
  "errors": [
    {
      "message": "DER not found",
      "locations": [{"line": 3, "column": 5}],
      "path": ["wallet", "site", "der"],
      "extensions": {
        "code": "DER_NOT_FOUND",
        "derSerial": "INVALID_SERIAL",
        "timestamp": 1755701251122
      }
    }
  ],
  "data": null
}
```

### Common Error Codes

| Code | Description | Action |
| ---- | ----------- | ------ |
| `WALLET_NOT_FOUND` | Invalid wallet ID | Verify wallet ID |
| `SITE_NOT_FOUND` | Invalid site ID | Verify site ID |
| `DER_NOT_FOUND` | Invalid DER serial | Verify DER serial |
| `UNAUTHORIZED` | Invalid auth token | Refresh token |
| `RATE_LIMITED` | Too many requests | Implement backoff |
| `VALIDATION_ERROR` | Invalid input data | Check field formats |

### Field-Level Errors

Device-specific errors are included in the data response:

```json
{
  "data": {
    "wallet": {
      "site": {
        "der": {
          "serial": "BROKEN_DEVICE",
          "currentState": {
            "W": null,
            "status": "error"
          },
          "error": {
            "code": "SENSOR_FAILURE",
            "message": "MPPT1 voltage reading out of range",
            "severity": "warning",
            "timestamp": 1755701251122
          }
        }
      }
    }
  }
}
```

## Schema Requirements

For optimization-compatible devices, the GraphQL schema enforces these fields as non-nullable:

- **Generators**: `max_power_mw!` and `efficiency_pct!` are required for all generator types
- **Storage**: `max_power_mw!`, `efficiency_pct!`, and `capacity_mwh!` are required for all storage types; `charge_events!` is additionally required for "ev_battery" subtype
- **Loads**: `max_power_mw!` and `efficiency_pct!` are required for controllable load types (EV chargers, heat pumps)
- **Grid Interfaces**: `max_power_mw!` is required when the interface supports bidirectional power flow

This ensures optimization algorithms receive complete power and efficiency data for all energy assets.