---
sidebar_position: 0
slug: /archive/developer
---

# Legacy Developer Documentation

:::warning Archive Notice
This section contains archived developer documentation for legacy Sourceful Energy systems. The information here may be outdated and is preserved for historical reference only.
:::

## What's Archived Here

This archive contains documentation for legacy systems that are no longer actively developed:

### Cloud-to-Cloud Integration
Documentation for the legacy cloud integration methods used with the Sourceful Energy Gateway. This has been superseded by the current Zap-based architecture.

[View Cloud Integration Docs →](/archive/developer/cloud)

### Hardware/Firmware Guide
Documentation for the legacy Sourceful Energy Gateway and the open-source P1 reader firmware for the Zap. The Zap has since evolved into a universal connector with closed-source firmware.

[View Hardware/Firmware Docs →](/archive/developer/hardware)

## Current Development

For current development guidance, please refer to:

- **[Zap Developer Documentation](/developer/zap-for-developers)** - Information about the current Zap universal connector
- **[Developer Overview](/developer/developer)** - Main developer documentation hub
- **[API Documentation](/developer/API/api-docs)** - Current API reference

## About the Zap

The **Sourceful Energy Zap** is now our universal connector device based on ESP32-C3. Key features:

- **Protocols Supported**: P1 ports, Modbus TCP, Modbus RTU, MQTT (with more coming)
- **Architecture**: Closed-source firmware for the universal connector
- **Communication**: Real-time communication with Sourceful Energy Network servers with very low latency
- **Legacy Firmware**: The open-source P1 reader firmware is archived at [github.com/srcfl/srcful-zap-firmware](https://github.com/srcfl/srcful-zap-firmware)

## Why This Was Archived

We're now focusing exclusively on the Zap as our universal connector. The Sourceful Energy Gateway and legacy integration methods described in these documents are no longer the primary development path. These documents are preserved for:

- Historical reference
- Existing deployments that still use legacy systems
- Understanding the evolution of the Sourceful Energy Network

For any questions about current development, please refer to the current documentation or contact the Sourceful Energy team.
