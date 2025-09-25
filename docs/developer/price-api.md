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
      * [Get Tariffs by Location](#get-tariffs-by-location)
      * [List DSO Providers](#list-dso-providers)
      * [Get Power Tariffs](#get-power-tariffs)
      * [Get Tariff Information](#get-tariff-information)
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

- `area` (required): Area code (e.g., `SE3`, `SE4`, `DK2`, `NO1`)
- `date` (optional): Specific date for historical prices (format: `YYYY-MM-DD`)

**Example:**

```bash
curl "https://mainnet.srcful.dev/price/electricity/SE3"
```

**Response:**

```json
{
  "area": "SE3",
  "area_name": "Sweden",
  "currency": "EUR",
  "unit": "MWH",
  "resolution": "PT60M",
  "timezone": "UTC",
  "prices": [
    {
      "datetime": "2025-09-24T22:00:00+00:00",
      "price": 65.47
    },
    {
      "datetime": "2025-09-24T23:00:00+00:00",
      "price": 61.54
    }
  ],
  "metadata": {
    "provider": "ENTSO-E Transparency Platform",
    "data_source": "entsoe",
    "fetched_at": "2025-09-25T14:08:59.939610+00:00",
    "start_time": "2025-09-24T22:00:00+00:00",
    "last_updated": "2025-09-25T13:43:46.488747+00:00",
    "total_points": 48,
    "cached": true
  }
}
```



**Historical Prices:**

```bash
curl "https://mainnet.srcful.dev/price/electricity/SE3?date=2025-01-01"
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
      "area": "SE3",
      "country": "Sweden",
      "code": "10Y1001A1001A46L"
    },
    {
      "area": "AT",
      "country": "Austria",
      "code": "10YAT-APG------L"
    }
  ],
  "count": 39,
  "metadata": {
    "provider": "ENTSO-E Transparency Platform",
    "fetched_at": "2025-09-25T14:12:03.690167+00:00"
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
    "total_areas": 39,
    "last_updated": "2025-09-25T14:08:47.049913+00:00"
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
    },
    {
      "method": "GET",
      "path": "/price/electricity/areas",
      "summary": "List all supported electricity market areas"
    }
  ],
  "documentation": {
    "swagger": "/price/electricity/docs",
    "redoc": "/price/electricity/redoc"
  }
}
```

### Supported Areas

Currently supports 39 European electricity market areas including:

**Countries:** AT, BE, BG, CH, CY, CZ, DE, DK, EE, ES, FI, FR, GB, GR, HR, HU, IE, IT, LT, LU, LV, MT, NL, NO, PL, PT, RO, SE, SI, SK, TR

**Bidding Zones:** DK1, DK2, NO1-NO5, SE1-SE4

### Data Availability

- **Current prices**: Up to 48 hourly data points (today + tomorrow)
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

### Get Tariffs by Location

```http
GET /price/tariffs/lookup?lon={longitude}&lat={latitude}
```

**Parameters:**

- `lon` (required): Longitude coordinate
- `lat` (required): Latitude coordinate

**Example:**

```bash
curl "https://mainnet.srcful.dev/price/tariffs/lookup?lon=15.627251745859262&lat=58.4043017359851"
```

**Response:**

```json
{
  "lat": 58.4043017359851,
  "lon": 15.627251745859262,
  "area": "SE3",
  "tariff_provider_id": "tekniska_verken",
  "count_total": 59,
  "last_update": "2025-09-25T15:05:35.165813",
  "tariffs": [
    {
      "id": "20be3a86-0ffd-4efd-9157-217e2bbae427",
      "name": "Prislista Lägenhet 16-25A säkringsabonnemang",
      "description": "Säkringsabonnemang lägenhet och 1-fas",
      "product": "net.lnk.cons.fuse.lgh",
      "company": "Tekniska verken Linköping Nät AB"
    },
    {
      "id": "ef4b088e-1c8d-4e30-b83a-8d1e85d07d15",
      "name": "Prislista 16A standard",
      "description": "Konsumtionsabonnemang 16-63 A",
      "product": "net.lnk.cons.std.16A",
      "company": "Tekniska verken Linköping Nät AB"
    }
  ]
}
```

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
  "lastUpdated": "2025-09-25T15:17:26.122654",
  "operator": "Srcful Energy",
  "timeZone": "Europe/Stockholm",
  "identityProviderUrl": null,
  "total_tariffs": 194,
  "total_providers": 39,
  "successful_providers": 39,
  "last_aggregation": "2025-09-25T15:05:35.165813",
  "providers": [
    {
      "id": "goteborg_energi",
      "name": "Goteborg Energi",
      "tariff_count": 6
    },
    {
      "id": "tekniska_verken",
      "name": "Tekniska Verken",
      "tariff_count": 59
    },
    {
      "id": "bergs_tingslags_elektriska",
      "name": "Bergs Tingslags Elektriska AB",
      "tariff_count": 7
    }
  ],
  "errors": null
}
```

*Note: Response shows first 3 providers. Complete response includes all 39 DSO providers.*

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
    "total_tariffs": 194,
    "total_providers": 39
  },
  "endpoints": [
    {
      "method": "GET",
      "path": "/price/tariffs/lookup",
      "summary": "Get tariffs by geographic coordinates"
    },
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
  "id": "tekniska_verken",
  "name": "Tekniska Verken",
  "power_tariff_count": 59,
  "status": "success",
  "last_update": "2025-09-25T14:51:07.912777",
  "power_tariffs": [
    {
      "id": "20be3a86-0ffd-4efd-9157-217e2bbae427",
      "name": "Prislista Lägenhet 16-25A säkringsabonnemang",
      "description": "Säkringsabonnemang lägenhet och 1-fas",
      "product": "net.lnk.cons.fuse.lgh",
      "companyName": "Tekniska verken Linköping Nät AB",
      "provider": "tekniska_verken"
    },
    {
      "id": "ef4b088e-1c8d-4e30-b83a-8d1e85d07d15",
      "name": "Prislista 16A standard",
      "description": "Konsumtionsabonnemang 16-63 A",
      "product": "net.lnk.cons.std.16A",
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

- **194 power tariffs** from **39 DSO providers**
- **Geographic lookup** - Find tariffs and electricity areas by coordinates
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
