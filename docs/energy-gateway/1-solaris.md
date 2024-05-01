---
sidebar_position: 1
slug: /energy-gateway/
---

# Solaris batch

<div class="alert alert--primary" role="alert">
<i>Solaris, a wondrous star nestled in the vastness of the Milky Way galaxy, resides about 4,000 light-years from Earth. Its luminosity illuminates the depths of space, beckoning us to consider the limitless potential for renewable energy in our universe. As we gaze upon its radiance, we are reminded of the urgency to embrace sustainable energy practices on Earth, to harness the power of the sun and all the natural resources available to us, and to continue our pursuit of a brighter, greener future.</i>
</div><br />

The Srcful Energy Gateway (batch #1: "Solaris") is a hardware device designed to connect Distributed Energy Resources (DERs) to the Srcful network of gateways and is compatible with a growing number of inverters.

The Srcful Energy Gateway provides a digital identity to your Distributed Energy Resource (DER), enabling it to transact and prove its energy data on the blockchain. By connecting your DER to the Srcful network using the Energy Gateway, you can participate in Proof-of-Source and soon to come, Proof-of-Control incentive models, as well as other decentralized energy applications such as ancillary services.

<!-- If you're interested in joining this exclusive group of early adopters, simply visit the link below and fill out the form to register your interest.

<a class="button button--primary" href="https://forms.gle/nAdpEi4oCuNeBHto9">Sign up on our Notice of Interest</a> -->

## Features

The Srcful Energy Gateway is a versatile device that offers the following features:

- Support for major inverters: The gateway is compatible with major inverters, making it easy to integrate with existing DER installations using Modbus TCP.

- Rasberry Pi 4 based: The gateway is based on the popular Rasberry Pi platform, which provides high performance and relative low power consumption.

- Wifi connectivity: The gateway supports Wifi connectivity, which allows it to connect to other devices and the internet.

- Helium support: The gateway has Helium support, enabling it to connect to the Helium network for added connectivity options. (Not Solaris batch)

- Secure communication: The gateway uses industry-standard security protocols to ensure that all communication between devices is secure and private.

- Proof-of-Source and Proof-of-Control: The gateway will perform Proof-of-Source mechanism to ensure that energy transactions on the Srcful network are secure and verified. Proof-of-Control is planned to be launced 2024.

## How it works

The Srcful Energy Gateway works by connecting your DER to the Srcful network using Wifi. The gateway communicates with your DER using Modbus TCP, which is a standard protocol for connecting to inverters and other energy devices. There are at least three ways to connect the srcful energy gateway to the inverter.

![alt text](egw_setup.drawio.svg)

1. **Direct connection**: The gateway connects directly to the inverter using a Modbus TCP connection. This is the most common way to connect the gateway to an inverter.

2. **Via a Modbus TCP to RS485 converter**: If your inverter doesn't support Modbus TCP, you can still connect it to the Srcful Energy Gateway using a Modbus TCP to RS485 converter. The converter translates Modbus RTU (RS485) to Modbus TCP (Ethernet), allowing the gateway to communicate with the inverter that only support Modbus RTU. Modbus RTU is a single-master protocol, limiting communication to one device at a time. However, the converter acts as a bridge, enabling multiple devices to connect to the inverter via Modbus TCP. A list of compatible converters will be available soon.

3. **Via a Modbus TCP Proxy**: Your inverter does support Modbus TCP but allow only one connection at a time. You can use a Modbus TCP Proxy to connect multiple devices to the inverter. This way, you keep whatever connection you have with the inverter and connect the gateway to the proxy.

## Srcful Energy Gateway Compability

:::note
The Srcful Energy Gateway is compatible with >50% of the inverters on the market.
:::

See our list of compatible inverters: [Compatible inverters](./compatible-inverter/overview.md)

<!-- ## Srcful Energy Gateway Compatibility Chart

T.B.A

**Note:** The Srcful Energy Gateway is compatible with approximately 80% of the inverters on the market.

## Installation

Installing the Srcful Energy Gateway is easy. Here's what you need to do: -->

## Installation

Explore the comprehensive guide at: https://github.com/srcfl/egw-getting-started

## Support

If you need help with the Srcful Energy Gateway visit our community on Discord where you can connect with us and other users and developers.

Make sure to join us on Discord:

<a class="button button--primary" href="https://discordapp.com/invite/tux5qPDcWw">Srcful Discord</a>

## Conclusion

The Srcful Energy Gateway is a powerful and versatile device that enables your DER to participate in the decentralized energy economy. With support for major inverters and batteries, Wifi and Helium connectivity, and Proof-of-Source and Proof-of-Control, the gateway provides a complete solution for integrating your DER into the Srcful network.
