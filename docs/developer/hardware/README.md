---
sidebar_position: 0
sidebar_label: "Hardware Setup"
slug: /developer/hardware
---

# Hardware Setup

This section covers hardware-related topics for Sourceful Zap devices, including firmware flashing and device preparation.

## Getting Started

The Zap is built on ESP32-C3 hardware and requires firmware flashing before deployment. This section provides technical guidance for:

- Flashing Zap firmware to ESP32-C3 devices
- Preparing devices for shipment and deployment
- Hardware specifications and setup procedures

## Available Guides

### [Flashing Zap Firmware](/developer/hardware/flashing-zap-firmware)

Learn how to flash Sourceful Zap firmware to ESP32-C3 devices using the sequential flasher tool:
- Installation and setup
- Flashing process and workflow
- Extracting device serial numbers and public keys
- Troubleshooting common issues

### [Packaging Guide](/developer/hardware/packaging)

Step-by-step guide for packaging Zap devices after firmware flashing:
- Box assembly and preparation
- Quality control procedures
- Shipping considerations

## Hardware Platform

**Zap Hardware Specifications:**
- **Chipset**: ESP32-C3
- **Connection**: USB-C for flashing and power
- **Firmware**: Closed-source, optimized for coordination
- **Compatibility**: Works on commodity ESP32-C3 boards

The Zap's hardware-agnostic firmware can run on most ESP32-C3 boards (~$10 USD commodity hardware), making it accessible for global deployment.

## For Developers

If you're building applications on the Sourceful platform:
- **You don't need to flash Zaps yourself** - end users receive pre-flashed devices
- **Focus on the software side** - see [Zap for Developers](/developer/zap-for-developers)
- **Use the APIs** - access telemetry and control through our [GraphQL API](/developer/API/api-docs)

This hardware section is primarily for:
- Manufacturing and production teams
- Hardware partners and integrators
- Advanced users building custom installations

## Related Documentation

- [Zap for Developers](/developer/zap-for-developers) - Understanding the Zap platform and capabilities
- [Data Models](/developer/data-models) - WALLET > SITE > DEVICE > DER hierarchy
- [EMS Documentation](/developer/ems) - How Zaps integrate with the Energy Management System
