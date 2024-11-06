---
sidebar_position: 6
---

# Inverter Setup Guide

## Overview

The inverter setup is a crucial step that enables your gateway to communicate with your solar inverter. This connection allows for:
- Real-time power production monitoring
- Performance analytics
- Energy production verification
- System health monitoring

## Connection Methods

### 1. Direct Connection (Modbus TCP)
- Most modern inverters support this method
- Uses standard Ethernet/WiFi connection
- Requires inverter's IP address and port
- Default port is usually 502

### 2. Via RS485-to-Ethernet Converter
- For inverters with only RS485 (Modbus RTU) support
- Requires additional hardware
- Converts serial communication to network protocol
- Maintains compatibility with older inverters

### 3. Via Modbus TCP Proxy
- For inverters limited to single connections
- Allows multiple devices to connect
- Maintains existing monitoring setup
- Requires proxy configuration

## Setup Instructions

1. **Select Your Inverter**
   - Choose your inverter manufacturer from the list
   - If not listed, check compatibility documentation
   - Note: New inverters are regularly added

2. **Connection Details**
   - Enter the inverter's IP address
   - Verify the port number (usually 502)
   - Set the device address (typically 1)
   - Test connection before saving

3. **Configuration Verification**
   - System will test the connection
   - Verify data is being received
   - Check for any communication errors
   - Confirm proper readings

## Common Settings

### Default Ports
- Modbus TCP: 502
- SunSpec: 502
- Custom: Check inverter manual

### Device Addresses
- Single inverter: Usually 0 or 1
- Multiple inverters: 1-247
- Check inverter documentation or

## Troubleshooting

### Can't Find Inverter
- Verify inverter is powered on
- Check network connection
- Ensure you're on the same network
- Try scanning for devices again

### Connection Failed
- Verify IP address and port
- Check firewall settings
- Confirm inverter settings
- Try power cycling the inverter

### Data Not Updating
- Check connection stability
- Verify device address
- Ensure proper protocol selection
- Review inverter configuration

## Need More Help?

If you:
- Don't see your inverter listed
- Can't establish connection
- Need technical assistance
- Have compatibility questions

Contact our support team through Discord or email.

> Note: Keep your inverter manual handy during setup. Some manufacturers have specific requirements or settings that need to be enabled.