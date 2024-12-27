# Energy Gateway Integration Guide

## Automatic Device Discovery
Your Energy Gateway can automatically discover compatible devices on your network, including solar inverters, battery systems, smart meters, and other Decentralized Energy Resources (DERs).

While the scan is optimized to be network-friendly, it may temporarily affect network performance, and some inverter models might briefly become inaccessible to other devices during and shortly after the scan.

We recommend running this scan for the most seamless setup experience, even though manual configuration is available.

## Managing Device Integrations
Your Energy Gateway automatically scans for compatible devices on your network. These devices will appear in the "Devices found on your network" section. For each discovered device you can:

1. Press "Connect" to integrate it with your system
2. Use the dropdown menu (▼) next to "Connect" for additional options

If you don't see your device, use the "Scan" button in the top right to search again.

## Device Connection Details
### Auto-Discovered Information
When a device is found on your network, the system automatically detects several parameters:
- Name
- IP address
- Serial number (Sn)
- Connection type
- Device type

### Additional Settings
Some devices may require extra configuration:
- MAC address - Enter if needed for device authentication
- Port number - Required for specific device configurations
- Slave ID - Used for certain communication protocols (default: 0)

If the auto-discovered information is sufficient, simply press "Connect" to complete the integration. Otherwise, fill in any additional required fields before connecting.

## Custom Integrations
If your device isn't automatically discovered, you can:
1. Select "Setup Custom Integration"
2. Follow the configuration steps for your specific device

This is useful for:
- Devices that require manual configuration
- Devices with custom network settings
- Specialized equipment

## Managing Connections
All successfully connected devices appear in the "Connected devices" section below. From here you can:
- Monitor their connection status
- Access device-specific settings
- Remove integrations when needed

Note: Required fields vary by device type and manufacturer. Your device documentation can help determine which fields are necessary.


> Need more help? Please contact our support at [sourceful.energy/support](https://sourceful.energy/support) or browse trough our documentation at [docs.sourceful.energy](https://docs.sourceful.energy)