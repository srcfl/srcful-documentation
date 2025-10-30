---
sidebar_position: 5
slug: /developer/ems
pagination_prev: null
---
# Energy Management System (EMS)

Sourceful's Energy Management System (EMS) provides intelligent coordination and optimization of distributed energy resources. It combines cloud-based intelligence with edge execution to deliver low-latency control while maintaining resilience.

## Architecture Overview

The Sourceful EMS uses a **hybrid cloud-edge architecture** designed for both performance and reliability:

**Cloud Layer:**
- Core EMS coordination logic
- Optimization algorithms (price-based, tariff-aware)
- Site-level intelligence and forecasting
- Multi-site coordination and aggregation

**Edge Layer (Zap):**
- Local command execution
- Real-time device control
- Fallback logic for offline operation
- Secure credential storage (public/private key cryptography)

**Communication:**
- Low-latency bidirectional communication between cloud and Zap
- Secure authentication using cryptographic keys stored on Zap
- Real-time coordination for global energy protocol participation

## How It Works

### 1. Discovery and Connection

The Zap discovers and establishes connections with Distributed Energy Resources (DERs) at your site. Upon activation, the Zap:
- Authenticates with the Sourceful platform using secure credentials
- Reports available DERs and their capabilities
- Establishes low-latency communication channels
- Begins telemetry streaming

### 2. Cloud-Based Optimization

The Sourceful EMS analyzes your site data and makes intelligent decisions:
- **Price optimization**: Charge when electricity is cheap, discharge when expensive
- **Tariff optimization**: Minimize costs based on your specific rate structure
- **Grid services**: Participate in flexibility markets and demand response
- **Forecast-based control**: Predict solar generation, consumption patterns, and prices

The optimizer considers:
- Real-time and forecasted electricity prices
- Tariff structures (time-of-use, demand charges, etc.)
- Weather forecasts and solar generation predictions
- Historical consumption patterns
- Battery state of charge and capabilities
- Grid service opportunities

### 3. Edge Execution

Optimization decisions are sent to the Zap, which:
- Executes commands locally with minimal latency
- Translates high-level intents to device-specific protocols
- Monitors execution and reports status back to cloud
- Maintains secure control of connected DERs

### 4. Fallback and Resilience

**If the Zap loses internet connectivity**, it continues operating with fallback logic:
- Safe default behavior (e.g., maintain battery SoC, prevent over-discharge)
- Pre-cached schedules continue execution
- Local decision-making for critical operations
- Automatic reconnection and sync when connectivity returns

**Why hybrid?** While the Zap provides edge intelligence and resilience, the cloud coordination is essential for:
- Global energy coordination protocol participation
- Real-time market integration and price optimization
- Multi-site coordination and aggregation
- Advanced forecasting and machine learning models

This aligns with Sourceful's core thesis: **building the coordination protocol for global energy markets requires low-latency cloud connectivity combined with resilient edge execution**.

## Site-Based Optimization

The EMS operates at the **Site level** (see [Data Models](/developer/data-models) for hierarchy details):

A **Site** represents the logical grouping of your energy system - everything "behind the meter":
- Your grid connection point (meter)
- Solar panels (PV)
- Battery storage
- EV charger
- Hybrid inverter
- Other connected devices

The EMS optimizes the entire site as a coordinated system, not individual devices in isolation. For example:
- Charge battery from solar before exporting to grid
- Delay EV charging until electricity prices drop
- Discharge battery during peak price periods
- Coordinate multiple batteries for maximum value

## Device and Protocol Support

The EMS controls devices through the Zap's protocol-agnostic communication:
- **Modbus-TCP/RTU**: Inverters, batteries, EV chargers
- **MQTT**: IoT devices and smart controllers
- **P1**: Meter data for optimization inputs
- **Future protocols**: Expanding to support more device types

The EMS automatically recognizes device types and tailors control commands to each device's specific capabilities and communication protocol.

## Current Status

The Sourceful EMS is **not currently open to external developers**. It operates as an integrated service for Sourceful users.

Key capabilities:
- Automatic site optimization (no configuration required)
- Price and tariff-aware charging/discharging
- Grid service participation (where available)
- Multi-device coordination
- Resilient operation with cloud-edge hybrid model

We may open EMS capabilities to developers in the future. If you're interested in building energy applications on Sourceful's platform, please contact us at [developer@sourceful.energy](mailto:developer@sourceful.energy).

## Data Access

While the EMS itself is not open, developers can access:
- **Real-time telemetry** from connected DERs via GraphQL API
- **Historical data** for analytics and visualization
- **Site metadata** and configuration
- **Price and tariff data** via the [Price API](/developer/price-api)

See [Authentication & Permissioning](/developer/auth) for details on OAuth-style access with user-granted scopes.

## Related Documentation

- [Data Models](/developer/data-models) - Understanding the WALLET > SITE > DEVICE > DER hierarchy
- [Zap for Developers](/developer/zap-for-developers) - Edge execution platform
- [Price API](/developer/price-api) - Accessing pricing data for optimization
- [Authentication](/developer/auth) - OAuth-style permissioning model
