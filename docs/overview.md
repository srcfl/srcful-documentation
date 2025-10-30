---
sidebar_label: "Overview"
sidebar_position: 1
pagination_next: null
pagination_prev: null
slug: /
---

# Sourceful Energy — Developer Overview

:::tip Support
For product setup and troubleshooting, visit **[support.sourceful.energy](https://support.sourceful.energy/)**. This page focuses on developer concepts and integration paths.
:::

## What is Sourceful?

Sourceful activates the Grid Intelligence Layer — a coordination platform for distributed energy resources (DERs). We provide permissioned data access, control primitives, and pricing intelligence so you can build applications that read, predict, and act across the edge of the grid.

## The Connector (Zap)

Zap is our Connector — the base of the hardware layer. It anchors trustworthy, high‑fidelity telemetry and supports smart‑meter P1/HAN and additional edge integrations over time. Zap enables data for APIs, optimization, and flexibility participation. Installation lives in the support portal; developers consume the resulting streams and resources via APIs.

## Core capabilities
- Permissioning: OAuth‑style “Connect with Sourceful” for user‑granted scopes (read meter data, share tariffs, participate in programs).
- Data: near‑real‑time telemetry, historical reads, and tariff/price intelligence (see Price API).
- Control & Coordination: primitives for optimization, EMS integrations, and flexibility/VPP participation where available.

## Key concepts
- Assets & Sites: modeled resources (meters, EVs, PV, storage) tied to locations.
- Streams & Events: time‑series readings and change notifications.
- Tariffs & Prices: locality‑aware pricing for forecasting and dispatch decisions.
- Permissions: user‑granted scopes governing API access and actions.

## Developer entry points
- Authentication & scopes: see `/developer/auth.md` and `/developer/core-principles.md`.
- Data models: see `/developer/data-models.md`.
- Price & tariffs: see `/developer/price-api.md`.
- EMS & control: see `/developer/ems.md` and `/developer/zap-for-developers.md`.

Proceed to the Developer section (`/developer/`) to start building.
