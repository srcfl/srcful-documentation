---
sidebar_position: 2
slug: /developer/price_api
pagination_prev: null
---

# Price API Developer Guide

## Overview

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

## Endpoints

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

### Health Check

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

## Supported Areas

Currently supports 55+ European electricity market areas including:

**Countries:** AT, BE, BG, CH, CY, CZ, DE, DK, EE, ES, FI, FR, GB, GR, HR, HU, IE, IT, LT, LU, LV, MT, NL, NO, PL, PT, RO, SE, SI, SK, TR

**Bidding Zones:** DK1, DK2, NO1-NO5, SE1-SE4

## Error Responses

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

## Data Availability

- **Today's prices**: Available immediately
- **Day-ahead prices**: Available after 11:00 UTC for the next day
