---
sidebar_position: 5
slug: /developer/zap-for-developers
---

# Zap for Developers

The Zap is Sourceful's universal connector for distributed energy resources (DERs). It's a protocol-agnostic coordination platform that enables real-time communication between energy devices and the Sourceful Energy Network.

## What is Zap?

**Zap is a universal DER coordinator** - not just a P1 meter reader. It's designed to connect, coordinate, and control diverse energy resources through multiple communication protocols.

**Hardware Foundation:**
- ESP32-C3 chipset architecture
- Hardware-agnostic firmware (works on commodity ESP32-C3 boards)
- Closed-source firmware optimized for coordination
- Low-latency edge computing capabilities

**Design Philosophy:**
- **Local-first coordination**: Core control logic runs at the edge, minimizing cloud dependency
- **Protocol-agnostic**: Speaks the native language of your devices
- **Distributed deployment**: Multiple Zaps per installation for modular, flexible systems

## Supported Protocols

Zap supports multiple communication standards, enabling coordination across diverse DER types:

**P1 Port**
- EU utility meter standard
- Smart meter data reading
- Real-time energy data

**Modbus-TCP**
- Ethernet-based Modbus communication
- Common for modern inverters and energy systems
- Network-attached DER control

**Modbus-RTU (RS-485)**
- Serial communication standard
- Widely used in industrial/commercial installations
- Direct wired connections to inverters, batteries, etc.

**MQTT**
- Lightweight message protocol
- IoT device communication
- Flexible for various DER types

Multiple protocols can run simultaneously on a single Zap, enabling complex multi-device coordination.

## Architecture: Local-First Coordination

Zap operates on an edge computing model where coordination logic executes locally:

**Why Local-First:**
- Sub-second response times for grid services
- Reliable control without internet dependency
- Reduced latency for real-time optimization
- Better data quality and control precision

**Cloud Role:**
- Data aggregation and historical storage
- Advanced analytics and optimization algorithms
- Market integration and grid service coordination
- User interfaces (mobile app, web dashboard)

Core coordination continues to function even if cloud connectivity is temporarily lost.

## Distributed Deployment

Users often deploy **multiple Zaps per installation** for modular, flexible systems:

**Deployment Scenarios:**
- **Single Zap**: P1 meter reading only
- **Dual Zap**: Meter + Modbus inverter control
- **Multi-Zap**: Complex installations with multiple DER types

Each connection point can be a separate Zap, enabling independent protocol handling and easy system expansion.

## What Zap Provides Developers

- **Verified DER telemetry** normalized into platform resources (sites, meters, batteries, inverters)
- **Near-real-time readings** and historical access via APIs
- **Bidirectional control** capabilities (where DER APIs support it)
- **Price/tariff alignment** for forecasting and analytics (see [Price API](/developer/price-api))
- **Secure, user-granted access** using "Connect with Sourceful" OAuth-style scopes

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

## Migration Context

**From Previous Platforms:**
- **Blixt (Raspberry Pi 4)**: Earlier gateway, now migrating to ESP32-C3 for better scalability
- **Cloud Gateways**: Higher latency, internet-dependent coordination - Zap provides edge intelligence
- **Legacy Firmware**: Original open-source P1 reader firmware archived at [github.com/srcfl/srcful-zap-firmware](https://github.com/srcfl/srcful-zap-firmware)

Current Zap firmware is closed-source and optimized for universal coordination across multiple protocols.

## Regional Considerations

Protocol support and deployment patterns vary by region:

**Nordic/Sweden**: P1 port standard for utility meters
**Germany**: Developing V2X infrastructure and specific variants
**Australia**: RS-485 Modbus common for inverters
**Global**: Modbus (TCP/RTU) and MQTT widely supported

The protocol-agnostic approach enables Zap to work anywhere with supported communication standards.

## Legacy Documentation

For historical reference on the original Sourceful Energy Gateway and legacy P1 reader firmware:
- [Legacy Hardware/Firmware Documentation](/archive/developer/hardware)
- [Legacy Cloud Integration Documentation](/archive/developer/cloud)

These documents describe systems that are no longer actively developed but provide context for the evolution to the current Zap platform.

## Where to Go Next
- [Authentication & Permissioning](/developer/auth)
- [Data Models](/developer/data-models)
- [Price & Tariffs](/developer/price-api)
- [EMS/Control Integrations](/developer/ems)
- [API Documentation](/developer/API/api-docs)
