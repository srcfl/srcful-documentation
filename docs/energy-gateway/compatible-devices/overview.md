---
sidebar_position: 1
slug: /energy-gateway/compatible-devices/
---

# Overview

:::info
You will need a **compatible** Inverter to connect your Energy Gateway.
:::

## Modbus SunSpec Support

Good news for many Inverter owners! Our Energy Gateway supports Inverters that implement the Modbus SunSpec standard. This means:

**Our Energy Gateway is compatible with all Inverters that conform to the Modbus SunSpec standard.**

Modbus SunSpec combines the Modbus communication protocol with the SunSpec data model standard. This combination is widely adopted by Inverter manufacturers. Our support for Modbus SunSpec significantly expands the range of compatible devices beyond our explicitly listed Inverter brands.

:::tip
Even if you don't see your specific Inverter model in our compatibility list below, it may still work with our Energy Gateway if it's SunSpec compliant.
:::

## Check Your Inverter's SunSpec Compatibility

To verify if your Inverter implements the SunSpec standard:

1. Visit the [SunSpec Certified Registry](https://sunspec.org/certified-registry/).
2. Use the search function to find your Inverter manufacturer or model.
3. Look for entries with the Certificate Type "SunSpec Modbus".

If your Inverter is listed with a SunSpec Modbus certificate, it should be compatible with our Energy Gateway.

## List of explicitly supported Inverters

_(Last updated 2024-11-04)_

We continuously add Inverters and update the table below.

| Inverter Make | Read Status   | Control Status | Protocol                | Communication Interface | Getting Started     |
| ------------- | ------------- | -------------- | ----------------------- | ----------------------- | ------------------- |
| Sungrow       | ✅ Ready      | 🔄 Planned     | Modbus TCP (SunSpec)    | Ethernet/Wi-Fi          | [Guide](#)          |
| Solaredge     | ✅ Ready      | 🔄 Planned     | Modbus TCP (SunSpec)    | Ethernet/Wi-Fi          | [Guide](#)          |
| Huawei        | ✅ Ready      | 🔄 Planned     | Modbus TCP              | Ethernet/Wi-Fi          | [Guide](#)          |
| Deye          | ✅ Ready      | 🔄 Planned     | Modbus TCP (SolarmanV5) | Wi-Fi                   | [Guide](#)          |
| Fronius       | ✅ Ready      | 🔄 Planned     | Modbus TCP (SunSpec)    | Ethernet/Wi-Fi          | [Guide](#)          |
| SMA           | ✅ Ready      | 🔄 Planned     | Modbus TCP (SunSpec)    | Ethernet/Wi-Fi          | [Guide](#)          |
| ferroamp      | ✅ Ready      | 🔄 Planned     | Modbus TCP              | Ethernet/Wi-Fi          | [Guide](#)          |
| APsystems     | ✅ Ready      | 🔄 Planned     | Modbus TCP (SunSpec)    | RS-485                  | [Guide](#)          |
| Enphase       | 📋 Evaluating | 🔄 Planned     | Local API               | Ethernet/Wi-Fi          | [Guide](enphase.md) |
| Solplanet     | 🔍 Untested   | 🔄 Planned     | Modbus TCP (SunSpec)    | RS-485                  | -                   |
| Kostal        | 🔍 Untested   | 🔄 Planned     | Modbus TCP (SunSpec)    | Ethernet                | -                   |
| ABB           | 🔍 Untested   | 🔄 Planned     | Modbus TCP (SunSpec)    | RS-485/Ethernet         | -                   |
| Schneider     | 🔍 Untested   | 🔄 Planned     | Modbus TCP (SunSpec)    | RS-485                  | -                   |
| Solis         | 🔍 Untested   | 🔄 Planned     | TBD                     | TBD                     | -                   |
| Sol-ark       | 🔍 Untested   | 🔄 Planned     | TBD                     | TBD                     | -                   |
| Growatt       | 🔄 Planned    | 🔄 Planned     | TBD                     | TBD                     | -                   |
| GoodWe        | 🔄 Planned    | 🔄 Planned     | TBD                     | TBD                     | -                   |
| Fox-Ess       | 🔄 Planned    | 🔄 Planned     | TBD                     | TBD                     | -                   |
| Eg4           | 🔄 Planned    | 🔄 Planned     | TBD                     | TBD                     | -                   |
| Sofar-solar   | 🔄 Planned    | 🔄 Planned     | TBD                     | TBD                     | -                   |
| Livoltek      | 🔄 Planned    | 🔄 Planned     | TBD                     | TBD                     | -                   |
| Lenercom      | 🔄 Planned    | 🔄 Planned     | TBD                     | TBD                     | -                   |
| Delta         | 🔄 Planned    | 🔄 Planned     | TBD                     | TBD                     | -                   |
| SAJ           | 🔄 Planned    | 🔄 Planned     | TBD                     | TBD                     | -                   |

### Status Legend

- ✅ Ready: Reading data is fully supported
- ⚡ Partial: Some control features are available
- 🔄 Planned: Control features are planned
- 📋 Evaluating: Device is under evaluation
- 🔍 Untested: Should work if SunSpec compatible, but not yet tested

## Can't find your specific Inverter model?

If you can't find your Inverter in the table above, or if you're unsure about Modbus SunSpec compatibility, don't hesitate to reach out:

<a class="button button--primary" href="https://discord.gg/Sourceful">Join Our Discord for Support</a>
