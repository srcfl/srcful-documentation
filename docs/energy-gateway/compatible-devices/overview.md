---
sidebar_position: 1
slug: /energy-gateway/compatible-devices/
---

# Overview

:::info
You will need a **compatible** DER (Distributed Energy Resource) to connect your Energy Gateway.
:::

## Modbus SunSpec Support

Good news for many DER owners! Our Energy Gateway supports DERs that implement the Modbus SunSpec standard. This means:

**Our Energy Gateway is compatible with all DERs that conform to the Modbus SunSpec standard.**

Modbus SunSpec combines the Modbus communication protocol with the SunSpec data model standard. This combination is widely adopted by DER manufacturers. Our support for Modbus SunSpec significantly expands the range of compatible devices beyond our explicitly listed DER brands.

:::tip
Even if you don't see your specific DER model in our compatibility list below, it may still work with our Energy Gateway if it's SunSpec compliant.
:::

## Check Your DER's SunSpec Compatibility

To verify if your DER implements the SunSpec standard:

1. Visit the [SunSpec Certified Registry](https://sunspec.org/certified-registry/).
2. Use the search function to find your DER manufacturer or model.
3. Look for entries with the Certificate Type "SunSpec Modbus".

If your DER is listed with a SunSpec Modbus certificate, it should be compatible with our Energy Gateway.

## List of explicitly supported DERs

_(Last updated 2024-09-16)_

We continuously add DERs and update the table below.

- ✅ - Supported
- ❌ - Not Supported
- 🔜 - To be evaluated

| DER         | Read | Control         | Status         | Compatible Models            |
| ----------- | ---- | --------------- | -------------- | ---------------------------- |
| Sungrow     | ✅   | Partial support | Evaluating     | [View Details](sungrow.md)   |
| Solaredge   | ✅   | 🔜              | Evaluating     | [View Details](solaredge.md) |
| Huawei      | ✅   | 🔜              | Evaluating     | [View Details](huawei.md)    |
| Deye        | ✅   | 🔜              | Evaluating     | Coming soon                  |
| Fronius     | ✅   | 🔜              | Evaluating     | [View Details](fronius.md)   |
| SMA         | ✅   | 🔜              | Evaluating     | [View Details](sma.md)       |
| Ferroamp    | ✅   | 🔜              | Evaluating     | Coming soon                  |
| Growatt     | 🔜   | 🔜              | In Development | -                            |
| GoodWe      | 🔜   | 🔜              | In Development | -                            |
| Fox-Ess     | 🔜   | 🔜              | Planned        | -                            |
| Solis       | 🔜   | 🔜              | Planned        | -                            |
| Enphase     | 🔜   | 🔜              | Planned        | -                            |
| Homegrid    | 🔜   | 🔜              | Planned        | -                            |
| Sol-ark     | 🔜   | 🔜              | Planned        | -                            |
| Eg4         | 🔜   | 🔜              | Planned        | -                            |
| Sofar-solar | 🔜   | 🔜              | Planned        | -                            |
| Livoltek    | 🔜   | 🔜              | Planned        | -                            |
| Lenercom    | 🔜   | 🔜              | Planned        | -                            |

## Can't find your specific DER model?

If you can't find your DER in the table above, or if you're unsure about Modbus SunSpec compatibility, don't hesitate to reach out:

<a class="button button--primary" href="https://discord.gg/Sourceful">Join Our Discord for Support</a>
