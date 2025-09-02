---
sidebar_position: 1
slug: /developer/core_principles
pagination_prev: null
---

# Core Principles

The Sourceful energy system is built on fundamental principles that ensure data integrity, energy conservation, and system reliability. These principles are foundational and constitutional - they govern all modeling, control, and accounting operations within the Sourceful ecosystem.

## Table of Contents

- [Foundational Principles](#foundational-principles)
  - [1. Energy is Primary](#1-energy-is-primary)
  - [2. The Site Boundary](#2-the-site-boundary)
  - [3. Canonical Sign Convention](#3-canonical-sign-convention)
  - [4. Units and Base System](#4-units-and-base-system)
  - [5. Determinism](#5-determinism)
  - [6. The Source of Time](#6-the-source-of-time)
  - [7. Simplicity & Extensibility](#7-simplicity--extensibility)
- [Conservation Example](#conservation-example)

## Foundational Principles

### 1. Energy is Primary

All modeling, control, and accounting start with energy. Power is always derived as ΔE/Δt. This hierarchy is never reversed.

### 2. The Site Boundary

Every calculation is framed relative to a clearly defined Site.

The Site is the thermodynamic control volume and, by default, the Point of Common Coupling (PCC) at the utility revenue/grid interconnection meter. All imports, exports, on-site generation, and storage are measured relative to this point.

If there are multiple service entrances, a single designated virtual Site must be declared, and all contributing meters explicitly mapped to it.

### 3. Canonical Sign Convention

- **Positive = flow into the Site**
- **Negative = flow out of the Site**

This rule applies universally across telemetry, metrics, storage, and control. Counters are always positive and monotonic, but are split into import and export streams.

### 4. Units and Base System

Internal representation uses only base SI units: watts (W), watt-hours (Wh), volts (V), amps (A), hertz (Hz), degrees Celsius (°C), and time as Unix ms or ISO-8601. Unit conversions are performed only at ingestion or egress boundaries.

### 5. Determinism

Physics must be conserved in every layer. The signed sum of all power (or interval energies) at the Site must balance within ε. Any violation is a fault, not "just noise."

### 6. The Source of Time

Time is stamped at the first Sourceful-controlled collection point. This is the temporal authority for all measurements.

**The Sourceful Time Rule:**
Timestamps are applied by our gateways at the moment of data ingestion. We explicitly do NOT trust device clocks from inverters, meters, or third-party hardware. The first Sourceful software that touches the data owns the timestamp.

**Gateway Time Requirements:**
- All Sourceful gateways must maintain NTP synchronization to a common time source
- Maximum acceptable drift: ±100ms between any two gateways at a Site
- Timestamps applied as Unix epoch milliseconds in UTC
- Gateway health includes NTP sync status and last sync time

**The Collection Moment:**
When a gateway reads a register (Modbus), receives a message (MQTT), or polls an API, it immediately stamps that measurement with its synchronized clock. This timestamp travels with the data forever - it is immutable and represents when Sourceful first observed the value.

**Example:**
An inverter reports 5247W but has a clock that's 3 hours off. Zap polls this inverter at 2024-01-15T14:30:00.000Z. The recorded measurement is:

```json
{
  "power_W": 5247,
  "timestamp": 1705330200000,
  "gateway": "zap-0342",
  "source": "inverter-01"
}
```

The SOURCE of time is Sourceful. Physics determines the values; we determine when we saw them.

### 7. Simplicity & Extensibility

The Core changes rarely and only with consensus. All extensions—such as IEEE mappings, schemas, metric rules, and gateway tier strategies—must conform to this document. The purpose of the Core is to set boundaries and invariants, not to prescribe implementation detail.

## Conservation Example

### Energy Balance at the PCC

The *Point of Common Coupling (PCC)* — the utility grid meter — is the **gate of the Site**. All energy must pass through this gate. The energy balance is written as:

```
ΔE(PCC) = LOAD + PV + BATT + EV + …
```

Every term is always **added with a plus sign**. The **sign of the value** encodes direction:

- **Positive (+)** → energy flowing into the Site (import, consumption, charging)
- **Negative (–)** → energy flowing out of the Site (export, generation, discharging)

**Examples:**

- Grid importing 3 kWh → `ΔE(PCC) = +3000 Wh`
- Grid exporting 2 kWh → `ΔE(PCC) = –2000 Wh`
- PV generation of 5 kWh → recorded as `–5000 Wh` (flow out of Site)
- Battery charging with 2 kWh → recorded as `+2000 Wh` (flow into Site)

The math is always a sum. Engineers don't need to remember which channels are "subtracted"; the rule is universal: direction is in the sign.

This formulation is not arbitrary; it is **energy conservation** applied at the Site boundary. The Site is treated as a **thermodynamic control volume**:

$$
\Delta E_\text{PCC} = \sum_i \Delta E_i
$$

The equation says: whatever crosses into or out of the Site must add up. Energy cannot vanish; it only changes form or direction. By always summing with plus signs and encoding direction in the sign of each term, we are directly enforcing conservation of energy in software.

Any mismatch beyond tolerance ε means something is broken — a meter error, telemetry bug, or mis-signed flow. This is how physics itself becomes a validator for the system.
