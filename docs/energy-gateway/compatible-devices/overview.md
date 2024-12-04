---
sidebar_position: 1
slug: /energy-gateway/compatible-devices/
---

# Overview

:::tip
Even if you don't see your specific Inverter model in our compatibility list below, it may still work with our Energy Gateway if it's SunSpec compliant.
:::

## List of explicitly supported Inverters

_(Last updated 2024-11-27)_

You will need a compatible Inverter to connect your Energy Gateway.

We continuously add Inverters and update the table below.

| Inverter Make | Read Status   | Control Status | Protocol                | Communication Interface | Getting Started     |
| ------------- | ------------- | -------------- | ----------------------- | ----------------------- | ------------------- |
| Sungrow       | ✅ Ready      | 🔄 Planned     | Modbus TCP (SunSpec)    | Ethernet/Wi-Fi          | Coming soon..       |
| Solaredge     | ✅ Ready      | 🔄 Planned     | Modbus TCP (SunSpec)    | Ethernet/Wi-Fi          | [Guide](solaredge.md)       |
| Huawei        | ✅ Ready      | 🔄 Planned     | Modbus TCP              | Ethernet/Wi-Fi          | Coming soon..       |
| Deye          | ✅ Ready      | 🔄 Planned     | Modbus TCP (SolarmanV5) | Wi-Fi                   | Coming soon..       |
| Fronius       | ✅ Ready      | 🔄 Planned     | Modbus TCP (SunSpec)    | Ethernet/Wi-Fi          | Coming soon..       |
| SMA           | ✅ Ready      | 🔄 Planned     | Modbus TCP (SunSpec)    | Ethernet/Wi-Fi          | Coming soon..       |
| ferroamp      | ✅ Ready      | 🔄 Planned     | Modbus TCP              | Ethernet/Wi-Fi          | Coming soon..       |
| APsystems     | ✅ Ready      | 🔄 Planned     | Modbus TCP (SunSpec)    | RS-485                  | Coming soon..       |
| Enphase       | ✅ Ready      | 🔄 Planned     | Local API               | Ethernet/Wi-Fi          | [Guide](enphase.md) |
| Sofar-solar   | ✅ Evaluating | 🔄 Planned     | Modbus TCP              | RS-485                  | Coming soon..       |
| Growatt       | ✅ Evaluating | 🔄 Planned     | Modbus TCP              | Ethernet/Wi-Fi          | Coming soon..       |
| Solplanet     | 🔍 Untested   | 🔄 Planned     | Modbus TCP (SunSpec)    | RS-485                  | -                   |
| Kostal        | 🔍 Untested   | 🔄 Planned     | Modbus TCP (SunSpec)    | Ethernet                | -                   |
| ABB           | 🔍 Untested   | 🔄 Planned     | Modbus TCP (SunSpec)    | RS-485/Ethernet         | -                   |
| Schneider     | 🔍 Untested   | 🔄 Planned     | Modbus TCP (SunSpec)    | RS-485                  | -                   |
| Solis         | 🔍 Untested   | 🔄 Planned     | TBD                     | TBD                     | -                   |
| Sol-ark       | 🔍 Untested   | 🔄 Planned     | TBD                     | TBD                     | -                   |
| GoodWe        | 🔄 Planned    | 🔄 Planned     | TBD                     | TBD                     | -                   |
| Fox-Ess       | 🔄 Planned    | 🔄 Planned     | TBD                     | TBD                     | -                   |
| Eg4           | 🔄 Planned    | 🔄 Planned     | TBD                     | TBD                     | -                   |
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

## Modbus SunSpec Support

**Our Energy Gateway is compatible with all Inverters that conform to the Modbus SunSpec standard.**

Modbus SunSpec combines the Modbus communication protocol with the SunSpec data model standard. This combination is widely adopted by Inverter manufacturers. Our support for Modbus SunSpec significantly expands the range of compatible devices beyond our explicitly listed Inverter brands. So if you can't find your specific Inverter model in the table above, it may still work with our Energy Gateway if it's SunSpec compliant.

## Can't find your specific Inverter model?

If you can't find your Inverter in the table above, or if you're unsure about Modbus SunSpec compatibility, don't hesitate to reach out:

<a class="button button--primary" href="https://discord.gg/Sourceful">Join Our Discord for Support</a>
