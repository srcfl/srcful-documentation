---
sidebar_position: 3
slug: /technical/data-models
pagination_prev: null
---

# Data Models

This document describes Sourceful's data model architecture: the logical hierarchy of resources, and where the telemetry and control field definitions for distributed energy resources live.

## Platform Hierarchy

Sourceful organizes energy resources in a four-level hierarchy:

### 1. ORGANIZATION → 2. SITE → 3. DEVICE → 4. DER

Users and API clients act through identities that belong to an Organization (Identity → Organization → Site → Device → DER).

### ORGANIZATION (Permission Layer)

The **Organization** is the top-level owner of resources. It represents:

- Ownership of everything beneath it
- The permission boundary for access to its resources
- The entity that grants or revokes access to applications

An Organization can own multiple Sites.

### SITE (Logical Grouping)

A **Site** represents a complete energy system - everything "behind the meter":

- The logical boundary for EMS optimization
- Typically corresponds to a physical location (home, building, facility)
- Contains all energy resources at that location
- The level where energy flows are balanced and optimized

**Example Site composition:**

- Grid connection point (meter)
- Solar panels (PV)
- Battery storage
- EV charger
- Hybrid inverter
- Heat pump

The Site concept is crucial because energy optimization happens at this level - you're optimizing the whole system, not individual devices in isolation.

### DEVICE (Physical Connection Point)

A **Device** represents the physical hardware you communicate with and control:

- The actual communication endpoint (Modbus address, MQTT client, P1 port)
- Often the electrical connection point
- What the Zap directly talks to via protocols

**Examples:**

- Hybrid inverter (Modbus-TCP device)
- EV charger (MQTT device)
- Smart meter (P1 device)
- Battery management system (Modbus-RTU device)

One Device may expose multiple DERs (see below).

### DER (Distributed Energy Resource)

A **DER** is the logical representation of an energy resource or function:

- What the energy system "sees" and models
- The unit of energy generation, storage, or consumption
- Can be a physical component or a logical representation

**Important concept:** DERs are often representations of capabilities "under" a Device, not always directly controllable entities.

**Example: Hybrid Inverter**

- **DEVICE**: The inverter itself (communication/control point via Modbus)
- **DER #1**: Solar PV (generation capability)
- **DER #2**: Battery (storage capability)
- **DER #3**: Inverter (the inverter's AC output)

You control the **Device** (inverter), but you represent its capabilities as separate **DERs** (solar, battery, inverter). You cannot directly control the battery - you control the inverter which manages the battery - but you still model the battery as a distinct DER for optimization purposes.

**DER Types:**

DER types and device types are owned by the device-support API (`GET /der-types`, `GET /device-types`):

- **DER types**: `solar`, `battery`, `inverter`, `meter`, `ev_charger_port`
- **Device types**: `inverter`, `battery`, `energy_meter`, `ev_charger`, `v2x_charger`

Each device type allows a fixed set of DER types. Inverter and meter are separate DERs: `inverter` is the inverter's AC output, `meter` is an energy meter (typically the grid connection).

## Hierarchy Example

```
ORGANIZATION: org_abc123
  └─ SITE: home_main_street
      ├─ DEVICE: hybrid_inverter_01 (inverter, Modbus-TCP)
      │   ├─ DER: pv_rooftop (solar)
      │   ├─ DER: battery_01 (battery)
      │   └─ DER: inverter_ac (inverter)
      ├─ DEVICE: v2x_charger_01 (v2x_charger, ISO 15118)
      │   └─ DER: port_1 (ev_charger_port)
      └─ DEVICE: smart_meter_01 (energy_meter, P1)
          └─ DER: grid_meter (meter)
```

In this example:

- The hybrid inverter is one physical device, but exposes three DERs
- Each Device may use a different protocol
- The Site optimizes across all DERs as a coordinated system
- The Organization controls access permissions for the entire hierarchy

---

## Telemetry and Control Data Models

The fields of each DER type (names, units, sign convention, shape) and the control command and acknowledgement are defined in one place: **[srcful-data-models](https://github.com/srcfl/srcful-data-models)** (v3.0.0). It publishes JSON Schema plus TypeScript, Go, Rust and Python types generated from the same schemas.

**Field reference:** [srcful-data-models `docs/REFERENCE.md`](https://github.com/srcfl/srcful-data-models/blob/main/docs/REFERENCE.md) lists every field per DER type. This page does not repeat it.

### Rules in Brief

- One flat JSON object per DER per reading, with `type` set to the device-support DER type (`solar`, `battery`, `inverter`, `meter`, `ev_charger_port`).
- Everything in a field name that is not a unit is lowercase (`soc_nom_fract`, `soh_fract`, `l1_V`, `total_charge_Wh_dc`); units keep their physical casing (`W`, `Wh`, `V`, `A`, `Hz`, `VA`, `var`, `C`).
- A quantity that can be AC or DC carries a lowercase `_ac` / `_dc` postfix: `W_ac`, `W_dc`, `V_dc`, `A_dc`, `total_charge_Wh_dc`, `total_import_Wh_ac`, `upper_limit_W_dc`, `rated_power_W_ac`. When a device measures both sides, send both.
- A quantity that can only be one side has no postfix: `Hz`, `VA`, `var`, `heatsink_C`, per-phase `l1_V` / `l1_A` / `l1_W`, `mppt1_V` … `mppt4_*` (always DC). EV charger DC values are `W_dc`, `V_dc`, `A_dc`.
- solar, battery, inverter and meter payloads carry at least one of `W_ac` / `W_dc` (optional for ev_charger_port).
- `timestamp` is Unix epoch **milliseconds**; `read_time_ms` is how long the read took (a duration, not a time).
- Every field is always present. A value that was not read is JSON `null`. **Never send 0 for a value that was not read.**
- Limits are scalars for battery and solar, and `[min, 0, max]` bands for EV charger ports.
- Inverter and meter are separate DERs: `inverter` is the inverter's AC output, `meter` is an energy meter (typically the grid connection).
- Control: `power_W_dc` is the battery's DC power target; the ack reports `actual_power_W_dc`.
- Base units only: W, Wh, V, A, Hz, °C, and fractions from 0.0 to 1.0. Never kW or kWh.
- No aliases: consumers move to the 3.0 names. NovaCore ingest still accepts the pre-3.0 names (`W`, `SoC_nom_fract` …) for now.

### Sign Convention

Sourceful sign convention: **+ import, − export**, seen from the DER. Power into the DER (charge, consume) is positive; power out of it (discharge, generation, delivery) is negative. Applies to `_ac` and `_dc` alike.

| DER | + | − |
|-----|---|---|
| solar | never | generating |
| battery | charging | discharging |
| inverter | absorbing AC | delivering AC |
| meter (grid) | import | export |
| ev_charger_port | charging the vehicle | V2G |
| control `power_W_dc` | charge | discharge |
