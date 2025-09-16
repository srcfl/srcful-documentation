---
sidebar_position: 4
slug: /developer/price_api
pagination_prev: null
---

# Price API Developer Guide

* [Price API Developer Guide](#price-api-developer-guide)
   * [Overview](#overview)
   * [Electricity Prices API](#electricity-prices-api)
      * [Base URL](#electricity-base-url)
      * [Documentation](#electricity-documentation)
      * [Get Electricity Prices](#get-electricity-prices)
      * [List Supported Areas](#list-supported-areas)
      * [API Overview](#electricity-api-overview)
      * [Supported Areas](#supported-areas)
      * [Data Availability](#data-availability)
   * [Power Tariffs API](#power-tariffs-api)
      * [Base URL](#tariffs-base-url)
      * [Documentation](#tariffs-documentation)
      * [List DSO Providers](#list-dso-providers)
      * [Get Tariff Information](#get-tariff-information)
      * [Get Power Tariffs](#get-power-tariffs)
      * [Datetime-Based Pricing](#datetime-based-pricing)
   * [Health Checks](#health-checks)

Comprehensive API suite for accessing European electricity spot prices and Swedish power tariffs from Distribution System Operators (DSOs).

## Overview

The Price API suite consists of two specialized services:

- **Electricity Prices API**: European electricity spot prices from ENTSO-E Transparency Platform with caching
- **Power Tariffs API**: Swedish electricity grid power tariffs from DSOs using the Eltariff-API v0.2.0 standard

## Electricity Prices API

European electricity spot prices from ENTSO-E Transparency Platform with daily caching at 11:00 UTC.

### Electricity Base URL

```
https://mainnet.srcful.dev/price/electricity
```

### Electricity Documentation

For interactive Swagger UI, visit [https://mainnet.srcful.dev/price/electricity/docs](https://mainnet.srcful.dev/price/electricity/docs).

Alternative ReDoc documentation: [https://mainnet.srcful.dev/price/electricity/redoc](https://mainnet.srcful.dev/price/electricity/redoc)

### Get Electricity Prices

```http
GET /price/electricity/{area}
```

**Parameters:**

- `area` (required): Two-letter country code (e.g., `SE`, `FR`, `NO`) or area code (e.g., `SE4`, `DK2`)
- `date` (optional): Specific date for historical prices (format: `YYYY-MM-DD`)

**Example:**

```bash
curl "https://mainnet.srcful.dev/price/electricity/SE4"
```

**Response:**

```json
{
  "area": "SE4",
  "area_name": "Sweden",
  "currency": "EUR",
  "unit": "MWH",
  "resolution": "PT60M",
  "timezone": "UTC",
  "prices": [
    {
      "datetime": "2025-09-15T22:00:00+00:00",
      "price": -0.01
    },
    {
      "datetime": "2025-09-15T23:00:00+00:00",
      "price": 0.03
    }
  ],
  "metadata": {
    "provider": "ENTSO-E Transparency Platform",
    "data_source": "entsoe",
    "fetched_at": "2025-09-16T08:07:11.673484+00:00",
    "start_time": "2025-09-15T22:00:00+00:00",
    "last_updated": "2025-09-16T07:53:44.393980+00:00",
    "total_points": 24,
    "cached": true
  }
}
```

**Historical Prices:**

```bash
curl "https://mainnet.srcful.dev/price/electricity/SE4?date=2025-01-01"
```

### List Supported Areas

```http
GET /price/electricity/areas
```

**Response:**

```json
{
  "areas": [
    {
      "name": "SE4",
      "country": "Sweden",
      "code": "10Y1001A1001A47J"
    },
    {
      "name": "AT",
      "country": "Austria",
      "code": "10YAT-APG------L"
    }
  ],
  "count": 42,
  "metadata": {
    "provider": "ENTSO-E Transparency Platform",
    "fetched_at": "2025-09-16T08:07:24.733636+00:00"
  }
}
```

### Electricity API Overview

```http
GET /price/electricity/
```

**Response:**

```json
{
  "name": "Electricity Price API - ENTSO-E Data Aggregator",
  "version": "1.0.0",
  "description": "European electricity spot prices from ENTSO-E Transparency Platform",
  "compliance": "ENTSO-E Transparency Platform",
  "statistics": {
    "total_areas": 42,
    "last_updated": "2025-09-16T08:06:44.171390+00:00"
  },
  "endpoints": [
    {
      "method": "GET",
      "path": "/price/electricity/",
      "summary": "API overview with statistics and endpoint information"
    },
    {
      "method": "GET",
      "path": "/price/electricity/{area}",
      "summary": "Get cached spot prices for specific area"
    }
  ],
  "documentation": {
    "swagger": "/price/electricity/docs",
    "redoc": "/price/electricity/redoc"
  }
}
```

### Supported Areas

Currently supports 42 European electricity market areas including:

**Countries:** AT, BE, BG, CH, CY, CZ, DE, DK, EE, ES, FI, FR, GB, GR, HR, HU, IE, IT, LT, LU, LV, MT, NL, NO, PL, PT, RO, SE, SI, SK, TR

**Bidding Zones:** DK1, DK2, NO1-NO5, SE1-SE4

### Data Availability

- **Today's prices**: Available immediately from cache
- **Day-ahead prices**: Available after 11:00 UTC for the next day
- **Historical prices**: Available using `?date=YYYY-MM-DD` parameter
- **Caching**: Prices fetched daily at 11:00 UTC and cached for performance
- **Resolution**: Hourly prices (PT60M) in UTC timezone
- **Currency**: EUR (Euro) for all areas
- **Unit**: MWH (Megawatt hours)

## Power Tariffs API

Swedish electricity grid power tariffs from DSOs (Distribution System Operators) using the Eltariff-API v0.2.0 standard.

*Implements the [Eltariff-API v0.2.0 specification](https://github.com/RI-SE/Eltariff-API) developed by RISE Research Institutes of Sweden.*

### Tariffs Base URL

```
https://mainnet.srcful.dev/price/tariffs
```

### Tariffs Documentation

For interactive Swagger UI, visit [https://mainnet.srcful.dev/price/tariffs/docs](https://mainnet.srcful.dev/price/tariffs/docs).

Alternative ReDoc documentation: [https://mainnet.srcful.dev/price/tariffs/redoc](https://mainnet.srcful.dev/price/tariffs/redoc)

### List DSO Providers

```http
GET /price/tariffs/providers
```

**Response:**

```json
{
  "name": "Eltariff API - Multi-DSO Aggregator",
  "apiVersion": "0.2.0",
  "implementationVersion": "1.0.0",
  "lastUpdated": "2025-09-16T08:08:06.626356",
  "operator": "Srcful Energy",
  "timeZone": "Europe/Stockholm",
  "identityProviderUrl": null,
  "aggregation": {
    "total_tariffs": 200,
    "total_providers": 39,
    "successful_providers": 39,
    "last_aggregation": "2025-09-16T08:01:43.147581",
    "providers": {
      "tekniska_verken": {
        "count": 65,
        "company_info": {
          "id": "tekniska_verken",
          "name": "Tekniska Verken"
        }
      }
    }
  }
}
```

### Tariffs API Overview

```http
GET /price/tariffs/
```

**Response:**

```json
{
  "name": "Eltariff API - Multi-DSO Aggregator",
  "version": "0.2.0",
  "description": "Aggregates electricity grid power tariffs from multiple Swedish DSOs",
  "compliance": "Eltariff-API v0.2.0 (RISE Research Institutes)",
  "statistics": {
    "total_tariffs": 200,
    "total_providers": 38
  },
  "endpoints": [
    {
      "method": "GET",
      "path": "/price/tariffs/{provider_id}",
      "summary": "Get all power tariffs from specific DSO"
    },
    {
      "method": "GET",
      "path": "/price/tariffs/tariff/{tariff_id}",
      "summary": "Get individual power tariff details"
    }
  ],
  "documentation": {
    "swagger": "/price/tariffs/docs",
    "redoc": "/price/tariffs/redoc"
  }
}
```

### Get Power Tariffs

```http
GET /price/tariffs/{provider_id}
```

**Parameters:**

- `provider_id` (required): Provider identifier (e.g., `tekniska_verken`, `bergs_tingslags_elektriska`)

**Example:**

```bash
curl "https://mainnet.srcful.dev/price/tariffs/tekniska_verken"
```

**Response:**

```json
{
  "provider": {
    "id": "tekniska_verken",
    "name": "Tekniska Verken"
  },
  "statistics": {
    "power_tariff_count": 65,
    "status": "success",
    "last_update": "2025-09-16T08:32:32.576563"
  },
  "power_tariffs": [
    {
      "id": "ae65838c-9d69-4a54-87f7-dd2a60e7fc9a",
      "name": "Prislista 16A standard",
      "description": "https://www.tekniskaverken.se/kundservice/priser-avtal/priser-elnat-2025/",
      "product": "Konsumtionsabonnemang 16-63 A",
      "companyName": "Tekniska verken Linköping Nät AB",
      "provider": "tekniska_verken"
    }
  ]
}
```

### Get Tariff Information

```http
GET /price/tariffs/tariff/{tariff_id}
```

**Parameters:**

- `tariff_id` (required): Unique tariff identifier (UUID)

**Example:**

```bash
curl "https://mainnet.srcful.dev/price/tariffs/tariff/ae65838c-9d69-4a54-87f7-dd2a60e7fc9a"
```

**Response:**

```json
{
  "tariff": {
    "id": "ae65838c-9d69-4a54-87f7-dd2a60e7fc9a",
    "name": "Prislista 16A standard",
    "description": "https://www.tekniskaverken.se/kundservice/priser-avtal/priser-elnat-2025/",
    "product": "Konsumtionsabonnemang 16-63 A",
    "companyName": "Tekniska verken Linköping Nät AB",
    "direction": "consumption",
    "timeZone": "Europe/Stockholm",
    "lastUpdated": "2025-03-14T08:50:33.7433959+00:00",
    "validPeriod": {
      "fromIncluding": "2025-01-01",
      "toExcluding": "2026-01-01"
    },
    "billingPeriod": "P1M",
    "fixedPrice": {
      "components": [
        {
          "name": "Abonnemangsavgift 16A standard",
          "priceExVat": 128,
          "priceIncVat": 160,
          "currency": "SEK",
          "pricedPeriod": "P1M"
        }
      ]
    },
    "energyPrice": {
      "components": [
        {
          "name": "Överföringsavgift (heldag)",
          "priceExVat": 0.1144,
          "priceIncVat": 0.143,
          "currency": "SEK",
          "pricedPeriod": "kWh"
        }
      ]
    },
    "powerPrice": {
      "components": [
        {
          "name": "Sommar (heldag)",
          "description": "",
          "priceExVat": 17.6,
          "priceIncVat": 22,
          "currency": "SEK",
          "pricedPeriod": "kW"
        }
      ]
    }
  }
}
```

### Datetime-Based Pricing

Get specific price components for a given datetime using the Eltariff-API v0.2.0 standard.

#### Get Power Price Components

```http
GET /price/tariffs/tariff/{tariff_id}/powerPrice/{datetime_str}
```

#### Get Energy Price Components

```http
GET /price/tariffs/tariff/{tariff_id}/energyPrice/{datetime_str}
```

#### Get Fixed Price Components

```http
GET /price/tariffs/tariff/{tariff_id}/fixedPrice/{datetime_str}
```

**Parameters:**

- `tariff_id` (required): Unique tariff identifier (UUID)
- `datetime_str` (required): ISO datetime string (e.g., `2025-01-15T10:30:00`)

**Example:**

```bash
curl "https://mainnet.srcful.dev/price/tariffs/tariff/ae65838c-9d69-4a54-87f7-dd2a60e7fc9a/powerPrice/2025-01-15T10:30:00"
```

**Response:**

```json
{
  "id": "93859d3a-825b-427b-891e-1b46d2d2ff42",
  "name": "Effektavgift standard",
  "description": "",
  "costFunction": "sum(peak(c)*price(c))",
  "unit": "kW",
  "components": [
    {
      "id": "1ec9cd13-070e-48d5-8f0c-3618fc68d768",
      "name": "Vinter (heldag)",
      "description": "",
      "type": "peak",
      "reference": "winter_fullday#1",
      "price": {
        "priceExVat": 34.4,
        "priceIncVat": 43,
        "currency": "SEK"
      },
      "validPeriod": {
        "fromIncluding": "2025-01-01",
        "toExcluding": "2025-04-01"
      },
      "peakIdentificationSettings": {
        "peakFunction": "peak(base)",
        "peakIdentificationPeriod": "P1D",
        "peakDuration": "PT1H",
        "numberOfPeaksForAverageCalculation": 5
      }
    }
  ],
  "datetime": "2025-01-15T10:30:00",
  "tariff_id": "ae65838c-9d69-4a54-87f7-dd2a60e7fc9a",
  "price_type": "powerPrice"
}
```

**Current Statistics:**

- **200 power tariffs** from **39 DSO providers**
- **Static data providers** - JSON files automatically scanned every 60 seconds
- **Compliance** - Full Eltariff-API v0.2.0 standard implementation
- **Time Zone** - Europe/Stockholm for all Swedish DSO data

## Health Checks

Both APIs provide health check endpoints for monitoring service status.

### Electricity API Health

```http
GET /price/electricity/health
```

### Tariffs API Health

```http
GET /price/tariffs/health
```

**Response Format:**

```json
{
  "status": "healthy"
}
```
