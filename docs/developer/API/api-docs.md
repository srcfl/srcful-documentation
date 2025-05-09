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

## Authentication

Currently, authentication is not required for basic access. We plan to implement JWT-based authentication in future releases to enable secure access to private data streams.
