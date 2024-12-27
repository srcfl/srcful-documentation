# Modbus TCP Configuration - APsystems ECU

## Communication Setup Overview

APsystems inverters use RS-485 communication via RJ45. To connect to a network, a bridge device is needed to convert RS-485 to Modbus TCP. The Waveshare RS485 to ETH converter (RS232/485 to ETH-B) can be used for this purpose and is available from [Waveshare](https://www.waveshare.com/RS232-485-TO-ETH.htm) directly.

## Prerequisites

- Mobile device with `EMA Manager` app installed from:
  - `App Store` (iOS)
  - `Play Store` (Android)
- Access to the `ECU` device
- `WiFi` connectivity
- Waveshare RS485 to ETH converter or equivalent RS-485 to TCP bridge
- RS-485 cable for connection between ECU and converter

## Configuration Process

### Initial Connection

1. Press the `AP` button on the `ECU`
2. Connect to WiFi network: `ECU_R_216xxxx`
3. Use password: `88888888`

### Modbus Configuration

1. Launch `EMA Manager`
2. Navigate to: `Local Access` → `Workspace` → `Sunspec Configuration`
3. Enable `Modbus` toggle
4. Save changes and acknowledge any warnings

### Bridge Setup

1. Connect the RS-485 cable between your ECU's RS-485 port and the Waveshare converter
2. Configure the converter's network settings according to your local network requirements
3. Make note of the IP address assigned to the converter - you'll need this for testing and monitoring

## Important Notes

- `AP mode` remains active for 1 hour
- Press `AP` button again to extend configuration time
- Your specific inverter IDs will differ from documentation examples
- Ensure proper wiring between ECU and RS-485 converter
- Keep the converter in a dry, protected location

## Testing Connectivity

After configuring both the ECU and the RS-485 to TCP bridge, you should verify that the connection is working properly. You can follow our [testing guide](https://github.com/srcfl/egw-getting-started/blob/main/test_con.md) to confirm the connection. When testing APsystems ECU devices through the bridge, remember that the default Modbus port is 502, and the Unit ID is typically set to 1. You may need to wait a few minutes after configuration before the Modbus TCP connection becomes active. When testing, use the IP address of your RS-485 to TCP bridge, not the ECU's IP address.

## Troubleshooting

### Connection Issues

If unable to connect to `ECU`:

1. Verify `AP mode` is active
2. Maintain close proximity to `ECU` during setup
3. Check WiFi password (eight 8s)

### Application Issues

If experiencing problems with the app:

1. Verify connection to `ECU` network
2. Restart `EMA Manager`
3. Update to latest version

### Modbus Problems

If Modbus is not functioning:

1. Confirm `Modbus` toggle is enabled
2. Verify inverter IDs are visible
3. Check RS-485 cable connections
4. Verify bridge device network settings
5. Test connection with monitoring system

### Bridge Communication Issues

If the RS-485 to TCP bridge isn't working:

1. Check power supply to the converter
2. Verify RS-485 cable connections and polarity
3. Confirm network settings on the converter
4. Test network connectivity to the converter's IP address

## Source

- Community
- [APsystems ECU Modbus Settings](https://global.apsystems.com/wp-content/uploads/2022/09/APsystems-Energy-Communication-Unit-ECU-R-User-Manual_Rev7.7_2022-08-30.pdf)
