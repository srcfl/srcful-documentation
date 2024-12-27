# Sungrow

The following guide describes how to configure the `Modbus TCP` settings for Sungrow inverters and how to test the connection.

## Configuration Note

Sungrow inverters come with `Modbus TCP` enabled by default. No additional configuration is required to use this feature.

# Prerequities

- A network connection by either:
  - An Ethernet cable connected to the `LAN port` on the inverter
  - Wireless connection with the `WiNet-S dongle` (the LAN port on the dongle does **NOT** work for Modbus)

## Verification

If you need to verify functionality:

1. Ensure inverter is properly connected to your network
2. Confirm network connectivity
3. Follow the testing procedure in the Testing Connectivity section below

## Testing Connectivity

Even though Modbus TCP comes enabled by default on Sungrow inverters, it's still important to verify that the connection is working properly. You can follow our [testing guide](https://github.com/srcfl/egw-getting-started/blob/main/test_con.md) to confirm the connection. For Sungrow inverters, use the default Modbus port 502. The Unit ID is typically set to 1. Testing the connection can help ensure that your network configuration is correct and that the inverter is properly accessible.

## Support

If you experience any issues with `Modbus TCP` communication, contact Sungrow support or your installer for assistance.

## Source

- Community
