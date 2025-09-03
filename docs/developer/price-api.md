---
sidebar_position: 4
slug: /developer/price_api
pagination_prev: null
---

# Price API Developer Guide


* [Price API Developer Guide](#price-api-developer-guide)
   * [Base URL](#base-url)
   * [Electricity Prices](#electricity-prices)
      * [Get Electricity Prices](#get-electricity-prices)
         * [Default Provider](#default-provider)
         * [Specific Provider](#specific-provider)
      * [List Supported Areas](#list-supported-areas)
      * [List Available Providers](#list-available-providers)
      * [Supported Areas](#supported-areas)
      * [Data Availability](#data-availability)
      * [Error Responses](#error-responses)
   * [Power Tariffs](#power-tariffs)
      * [List Power Tariff Providers](#list-power-tariff-providers)
      * [Get Tariff Information](#get-tariff-information)
      * [Get Pricing Rules](#get-pricing-rules)
      * [Calculate Power Price](#calculate-power-price)
   * [Health Check](#health-check)

REST API for accessing electricity prices from multiple providers. Returns today's prices and day-ahead prices (available after 11:00 UTC) in either raw XML format or unified JSON format.

## Base URL

```
https://mainnet.srcful.dev/price
```

<!-- ## Authentication

Authentication is configurable. When enabled, include JWT token in requests:

```bash
Authorization: Bearer <your-jwt-token>
``` -->

## Electricity Prices

For an interactive Swagger UI, visit [https://mainnet.srcful.dev/price/api](https://mainnet.srcful.dev/price/api).

### Get Electricity Prices

#### Default Provider

```http
GET /price/prices/{area}?format=json
```

#### Specific Provider

```http
GET /price/providers/{provider}/prices/{area}?format=json
```

**Parameters:**

- `provider` (required): Provider identifier (e.g., `entsoe`).
- `area` (required): Two-letter country code (e.g., `SE`, `FR`, `NO`) or area code (e.g., `SE4`, `DK2`)
- `format` (optional): Response format
  - Omit for raw XML (default)
  - `json` for unified JSON format

**Example:**

```bash
curl "https://mainnet.srcful.dev/price/prices/SE4?format=json"
```

**JSON Response:**

```json
{
  "area": "SE4",
  "currency": "EUR",
  "unit": "MWh",
  "prices": [
    {
      "start_time": "2024-01-01T00:00:00Z",
      "end_time": "2024-01-01T01:00:00Z",
      "price": 45.67
    }
  ],
  "provider": "entsoe",
  "last_updated": "2024-01-01T12:00:00Z"
}
```

### List Supported Areas

```http
GET /price/areas
```

**Response:**

```json
{
  "supported_areas": [
    {
      "name": "SE4",
      "country": "Sweden",
      "code": "10Y1001A1001A47J"
    }
  ],
  "total_count": 55
}
```

### List Available Providers

```http
GET /price/providers
```

**Response:**

```json
{
  "available_providers": {
    "entsoe": "ENTSO-E Transparency Platform"
  },
  "active_providers": {
    "entsoe": {
      "name": "entsoe",
      "description": "European electricity prices",
      "areas_count": 55
    }
  },
  "total_available": 1,
  "total_active": 1
}
```

### Supported Areas

Currently supports 55+ European electricity market areas including:

**Countries:** AT, BE, BG, CH, CY, CZ, DE, DK, EE, ES, FI, FR, GB, GR, HR, HU, IE, IT, LT, LU, LV, MT, NL, NO, PL, PT, RO, SE, SI, SK, TR

**Bidding Zones:** DK1, DK2, NO1-NO5, SE1-SE4

### Data Availability

- **Today's prices**: Available immediately
- **Day-ahead prices**: Available after 11:00 UTC for the next day

### Error Responses

**Area Not Supported:**

```json
{
  "detail": "Area 'XX' not supported"
}
```

**No Data Available:**

```json
{
  "error": "No data available",
  "area": "SE4",
  "provider": "entsoe",
  "message": "No matching data found",
  "status": "no_data"
}
```

## Power Tariffs

#### List Power Tariff Providers

```http
GET /price/power-tariff/providers
```

**Response:**

```json
{
  "supported_providers": [
    {
      "provider": "ellevio",
      "provider_display_name": "Ellevio"
    },
    {
      "provider": "goteborg_energi",
      "provider_display_name": "Göteborg Energi"
    }
  ],
  "total_count": 2
}
```

#### Get Tariff Information

```http
GET /price/power-tariff/{provider}
```

**Parameters:**

- `provider` (required): Provider identifier (e.g., `ellevio`, `goteborg_energi`)

#### Get Pricing Rules

```http
GET /price/power-tariff/{provider}/rules
```

Returns detailed pricing rules including time-based pricing and peak calculations.

**Response:**

```json
{
  "provider": "Göteborg Energi",
  "country": "Sweden",
  "currency": "SEK",
  "fuse_sizes": ["16A", "20A", "25A", "35A", "50A", "63A"],
  "pricing_rules": {
    "winter_high": {
      "description": "High price during winter weekdays",
      "season": {"start_month": 11, "end_month": 3},
      "time_range": {"start": "07:00", "end": "20:00"},
      "days": "weekdays_non_holidays",
      "price_per_kw": 132
    },
    "summer_all": {
      "description": "Low price all day during summer",
      "season": {"start_month": 4, "end_month": 10},
      "time_range": {"start": "00:00", "end": "23:59"},
      "days": "all_days",
      "price_per_kw": 0
    }
  },
  "num_peaks": 3,
  "holidays": ["2025-01-01", "2025-01-06", "..."],
  "note": "Price varies by time of day and season. Uses winter time (CET) all year. Cost based on average of three highest peaks."
}
```

#### Calculate Power Price

```http
GET /price/power-tariff/{provider}/calculate?timestamp={iso_datetime}&fuse_size={size}
```

Calculate power price for a specific timestamp and fuse size.

**Parameters:**

- `provider` (required): Provider identifier
- `timestamp` (required): ISO datetime (e.g., `2025-01-15T10:30:00`)
- `fuse_size` (optional): Fuse size (e.g., `16A`, `20A`)

**Example:**

```bash
curl "https://mainnet.srcful.dev/price/power-tariff/goteborg_energi/calculate?timestamp=2025-04-30T23:30:00&fuse_size=16A"
```

**Response:**

```json
{
  "provider": "Göteborg Energi",
  "timestamp": "2025-04-30T23:30:00",
  "currency": "SEK",
  "fuse_size": "16A",
  "applied_rules": [
    {
      "rule": "summer_all",
      "description": "Low price all day during summer",
      "price": 0
    }
  ],
  "base_price_per_kw": 132,
  "final_price_per_kw": 0,
  "multiplier": 0
}
```

## Health Check

```http
GET /price/health
```

**Response:**

```json
{
  "status": "healthy",
  "active_providers": 1,
  "providers": ["entsoe"]
}
```
