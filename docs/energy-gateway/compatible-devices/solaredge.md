# Modbus TCP Configuration - SolarEdge Inverter

The following guide describes how to configure the `Modbus TCP` settings for SolarEdge inverters and how to test the connection.

## Prerequisites

- Network connectivity (Ethernet or WiFi)
- Physical access to inverter
- Web browser
- Mobile device with camera

## Configuration Process

### Physical Access Setup

1. Locate the `on/off` switch on the inverter
   - Usually has a red cap
   - Typically found near the bottom left of the inverter
2. Push the switch to the left (`P`) for 1 second
3. Release the switch

### Network Connection

1. Locate the `QR code` on the right side of the inverter
2. Scan the `QR code` using your phone's camera
3. Connect to the WiFi network indicated by the code
   - Note: You may receive a notification about the network lacking internet access
   - If this occurs, select "Use network anyways"

### Modbus Configuration

1. Open a web browser
2. Navigate to `http://172.16.0.1/`
3. Find the "Communication Settings" section
4. Enable the `Modbus TCP` option
5. Note the port number shown
   - Usually `502` or `1502`
   - You'll need this for future reference

## Important Notes

- Document the port number for future use
- Maintain network connectivity during configuration
- Ensure proper physical access to inverter switches

## Testing Connectivity

After enabling Modbus TCP on your SolarEdge inverter, it's important to verify that the connection is working properly. You can follow our [testing guide](https://github.com/srcfl/egw-getting-started/blob/main/test_con.md) to confirm the connection. For SolarEdge inverters, try both port 502 and 1502, as the port number can vary between models and firmware versions. The Unit ID is typically set to 1. Make sure to document both the working port number and Unit ID for future reference, as you'll need these for any monitoring setup.

## Troubleshooting

### Connection Issues

If unable to connect:

1. Verify `QR code` scan was successful
2. Check WiFi connection status
3. Confirm correct `IP` address entry

### Configuration Problems

If settings don't apply:

1. Refresh browser page
2. Verify network connection
3. Try alternative browser

## Source

- Community
- [SolarEdge Modbus TCP Configuration Guide](https://github.com/binsentsu/home-assistant-solaredge-modbus?tab=readme-ov-file#enabling-modbus-tcp-on-solaredge-inverter)
