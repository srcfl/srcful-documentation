---
sidebar_position: 5
slug: /developer/zap
---

# Zap for Developers

Zap (the Connector) anchors our hardware layer. It includes the smart‑meter P1/HAN interface and provides high‑fidelity meter telemetry to the Sourceful platform so your applications can read trustworthy energy data, align with tariffs, and build automations. This page describes the developer‑relevant interface, not installation.

## What Zap Provides
- Verified meter telemetry normalized into platform resources (sites, meters).
- Near‑real‑time readings and historical access via APIs.
- Price/tariff alignment for forecasting and analytics (see Price API).
- Secure, user‑granted access using “Connect with Sourceful” scopes.

## Access Pattern
1. Obtain a delegated token with `read:meter` (and optionally `read:tariff`, `read:site`).
2. Query readings/history for authorized meters and time ranges.
3. Subscribe to change streams or poll for new samples (depending on your integration).

## Data Model Overview
Refer to `/developer/data-models.md` for canonical schemas. Typical reading payloads include:
```
{
  siteId: string,
  meterId: string,
  timestamp: string (ISO 8601),
  measurements: Array<{ key: string, value: number, unit: string }>,
  source: "zap"
}
```
Notes:
- Keys are normalized from meter outputs; availability varies by meter model/locale.
- Use `siteId`/`meterId` for correlation; do not infer identity from labels.
- Units are explicit; do not assume defaults.

## Cadence & Reliability
- Cadence: Near real‑time; exact sample rate depends on meter capabilities and local standards.
- Ordering: Treat events as eventually consistent; use timestamps and sequence where provided.
- Gaps: Handle temporary gaps (connectivity, meter limits). Prefer cumulative counters for reconciliation when available.
- Idempotency: Use `(meterId, timestamp, key)` as a stable identity when deduplicating.

## Best Practices
- Request least‑privilege scopes and narrow resources to specific sites/meters.
- Store and aggregate locally for your UX, but reconcile periodically with historical reads.
- Treat tariffs/prices as time‑varying; always fetch by effective window.
- Be robust to missing fields; meters differ by market and firmware.

## Where to Go Next
- Authentication & Permissioning: `/developer/auth.md`
- Data Models: `/developer/data-models.md`
- Price & Tariffs: `/developer/price-api.md`
- EMS/Control Integrations: `/developer/ems.md`
