---
sidebar_position: 1
slug: /energy-gateway/
---

# Introduction

Introducing a revolutionary piece of hardware: The Sourceful Energy Gateway.

## Product Overview

The Sourceful Energy Gateway is a user-friendly and innovative device designed to connect Decentralized Energy Resources (DERs) such as solar plants and battery storage to Sourcefuls energy network. It enables users to participate in building a global virtual power plant (VPP) while earning rewards for their contributions.

## Key Features

- Get rewards for connecting and sharing data.
- Contribute to a decentralized, community-driven energy network
- Visualize and compare your energy contributions
- Participate in grid stabilization and smart energy management (future features)
- Connect compatible solar inverters and batteries using a web application on your Android phone or laptop (iOS support coming in Q4 2024)

## How it works

The Sourceful Energy Gateway works by connecting your DER to the Sourceful network using Wifi. The gateway communicates with your DER using Modbus TCP, which is a standard protocol for connecting to inverters and other energy devices. There are at least three ways to connect the Sourceful energy gateway to the inverter.

![alt text](egw_setup.drawio.svg)

1. **Direct connection**: The gateway connects directly to the inverter using a Modbus TCP connection. This is the most common way to connect the gateway to an inverter.

2. **Via an RS485-to-Ethernet converter**: If your inverter doesn't support Modbus TCP, you can still connect it to the Sourceful Energy Gateway using an RS485-to-Ethernet converter. The converter translates Modbus RTU (RS485) to Modbus TCP (Ethernet), allowing the gateway to communicate with the inverter that only support Modbus RTU. Modbus RTU is a single-master protocol, limiting communication to one device at a time. However, the converter acts as a bridge, enabling multiple devices to connect to the inverter via Modbus TCP. A list of compatible converters will be available soon.

3. **Via a Modbus TCP Proxy**: Your inverter does support Modbus TCP but allow only one connection at a time. You can use a Modbus TCP Proxy to connect multiple devices to the inverter. This way, you keep whatever connection you have with the inverter and connect the gateway to the proxy.

## Sourceful Energy Gateway Compability

:::note
The Sourceful Energy Gateway is compatible many well known inverter brands on the market. We are constantly working on adding support for more inverters.
:::

See our list of compatible devices: [Compatible devices](./compatible-devices/overview.md)

<!-- ## Sourceful Energy Gateway Compatibility Chart

T.B.A

**Note:** The Sourceful Energy Gateway is compatible with approximately 80% of the inverters on the market.

## Installation

Installing the Sourceful Energy Gateway is easy. Here's what you need to do: -->

## Installation

Explore the comprehensive guide at: https://github.com/srcfl/egw-getting-started

## Support

If you need help with the Sourceful Energy Gateway visit our community on Discord where you can connect with us and other users and developers.

Make sure to join us on Discord:

<a class="button button--primary" href="https://discord.gg/Sourceful">Sourceful Discord</a>

## Conclusion

The Sourceful Energy Gateway is a powerful and versatile device that enables your DER to participate in the decentralized energy economy. With support for major inverters and batteries, Wifi and Helium connectivity, and Proof-of-Source and Proof-of-Control, the gateway provides a complete solution for integrating your DER into the Sourceful network.
