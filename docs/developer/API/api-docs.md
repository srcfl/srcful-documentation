---
sidebar_position: 1
slug: /developer/api/docs
pagination_prev: null
---

# GraphQL API

## Overview

The Sourceful GraphQL API provides access to real-time and historical data from distributed energy resources (DERs). You can query solar production, battery storage, and energy consumption data to build powerful monitoring and analytics applications.

## Quick Start

```bash
# Basic query example
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ derData { solar(gwId: \"your-gateway-id\") { latest { ts power } } } }"}' \
  https://api.srcful.dev
```
## Keys and Identifiers

The GraphQL API uses several different identifiers to access data from distributed energy resources (DERs). Understanding these identifiers is crucial for effectively querying the API and retrieving the correct data.

### The Gateway Concept
In the Sourceful ecosystem, all data access is managed through the concept of gateways. A gateway is any device or service that collects and transmits data from energy resources to the Sourceful platform.

### Key Identifier Types

| Identifier | Format | Description | Used In |
|------------|--------|-------------|---------|
| Gateway ID (`gwId`) | String (e.g., "012307e4843d412cee") | Unique identifier for a device | Querys where the full context of the device/gateway is used |
| DER Serial Number (`sn`) | String (e.g., "pv-JgpMp...JhRP") | Hashed/encoded identifier for a specific DER, have a prefix in the start (e.g., em-, pv-) that shows the type of DER it represents | Used to query data from a specific device in the network |
| Raw Serial Number (`rawSn`) | String | Actual serial number of the physical device (only available via authentication) | Limited use |
| Device Reference (`devRef`) | String | Reference to connect multiple DERs to the same physical device | Used to know the physical connection between DERs |

#### Understanding the Relationship Between IDs

1. A Device/Gateway (gwId) can have multiple DERs connected to it
2. Each DER has a unique Serial Number (sn)
3. Multiple DERs may reference the same physical device via devRef
4. The rawSn is the actual hardware serial number (only available to authenticated users)

### API Playground & Gateway Explorer

Want to experiment first? Visit our interactive [API Playground](https://api.srcful.dev/playground) to build queries, explore the schema, and see real-time results.

Need gateway IDs to use in your queries? Check out the [Sourceful Explorer](https://explorer.sourceful.energy) to find active gateways and their IDs for testing.

## Available Data Sources

Our API gives you access to multiple energy data sources through a unified interface:

| Data Source | Description | Key Metrics |
|-------------|-------------|------------|
| Solar | Solar panel production | Current power (kW), Daily totals (kWh) |
| Battery | Battery storage systems | State of charge (%), Power flow (kW) |
| Energy Meter | Grid tie consumption/export | Consumption (kW), Delivery (kW), Phase data |

In general, data can be queried on a per gateway or specific DER basis. Use the [API Playground](https://api.srcful.dev/playground) for the most recent documentation and queries.

## Example Queries

### List gateway DERS
```graphql
{
  gateway {
    gateway(id: "your-gateway-id") {
      ders {
        type
        sn
      }
    }
  }
}
```

### Real-time Solar Production for a gateway

```graphql
{
  derData {
    solar(gwId: "your-gateway-id") {
      latest {
        ts
        power  # Current power in kW
      }
      today   # Total generation today in kWh
    }
  }
}
```

### Real-time Solar Production for a solar DER

```graphql
{
  derData {
    solar(sn: "your-der-serial-number") {
      latest {
        ts
        power  # Current power in kW
      }
      today   # Total generation today in kWh
    }
  }
}
```

### Battery Status with Historical Data

```graphql
{
  derData {
    battery(gwId: "your-gateway-id") {
      latest {
        ts
        power  # Positive = charging, Negative = discharging
        soc    # State of charge percentage
      }
      historical(
       start: "2025-04-01T00:00:00Z",
        stop: "2025-05-01T23:59:59Z",
        resolution: "15m"
      ) {
        ts
        power
        soc
      }
    }
  }
}
```

### Grid Consumption & Export

```graphql
{
  derData {
    energyMeter(gwId: "your-gateway-id") {
      latest {
        ts
        consumption  # Grid power consumed (kW)
        delivery     # Power exported to grid (kW)
        consumptionL1
        consumptionL2
        consumptionL3
      }
      daily(start: "2025-04-01", stop: "2025-05-01") {
        ts
        consumption
        delivery
      }
    }
  }
}
```

## Time-Series Data Options

Control how you retrieve historical data with these flexible parameters:

### Time Ranges
- Specify precise start/stop times using ISO-8601 format
- Custom date ranges for daily aggregations

### Resolution Options
The `resolution` parameter accepts these formats:
- `"15s"` - 15-second intervals
- `"5m"` - 5-minute intervals 
- `"1h"` - Hourly intervals
- `"1d"` - Daily intervals

## Example Python Code
The below example shows how programmatically query for data.
```python
import requests
import json

GRAPHQL_ENDPOINT = "https://api.srcful.dev/"
GW_ID = "Your Gateway ID"  # Replace with your actual gateway ID

def fetch_battery_data():
    """
    Fetches battery data (latest and historical) from the backend API.
    """
    print("Fetching battery data...")

    # Construct the GraphQL query
    query = f"""
    {{
      derData {{
        battery(gwId: "{GW_ID}") {{
          latest {{
            ts
            power
            soc
          }}
          historical(
            start: "2025-04-01T00:00:00Z",
            stop: "2025-04-03T23:59:59Z",
            resolution: "15m"
          ) {{
            ts
            power
            soc
          }}
        }}
      }}
    }}
    """

    # Prepare the request payload
    graphql_request_payload = {
        "query": query
    }

    # Send the request to the backend
    try:
        print(f"Sending request to backend: {GRAPHQL_ENDPOINT}")
        response = requests.post(
            GRAPHQL_ENDPOINT,
            json=graphql_request_payload,
            headers={'Content-Type': 'application/json'},
            timeout=30 
        )
        response.raise_for_status() 

        # Print the response
        print(f"Backend Status Code: {response.status_code}")
        response_data = response.json()
        print("Backend Response:")
        print(json.dumps(response_data, indent=2))

        # Check for GraphQL errors
        if 'errors' in response_data:
            print("\n--- GraphQL Errors ---")
            for error in response_data['errors']:
                print(f"- {error.get('message', 'Unknown error')}")
            print("----------------------")
        elif 'data' in response_data:
            print("\nBattery Data:")
            print(json.dumps(response_data['data'], indent=2))

    except requests.exceptions.RequestException as e:
        print(f"Error sending request to backend: {e}")
    except json.JSONDecodeError:
        print(f"Error decoding JSON response from backend: {response.text}")

# --- Main Execution ---
if __name__ == "__main__":
    fetch_battery_data()
```

