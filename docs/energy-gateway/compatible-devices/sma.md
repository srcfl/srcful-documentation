# SMA

The following guide describes how to configure the `Modbus TCP` settings for SMA inverters and how to test the connection.

## Prerequisites

### Required Items

- WiFi-capable device (smartphone, tablet, or laptop)
- Inverter `serial number`
- `WPA2-PSK` password (located on inverter label)
- `Installer` rights for certain settings

## Configuration Process

### Initial Connection

Choose one of these connection methods:

#### WiFi Connection

1. Find network named `SMA19xxxxxxx`
2. Use IP address: `192.168.12.3`

#### Ethernet Connection

1. Connect via ethernet cable
2. Use IP address: `169.254.12.3`

### Settings Configuration

1. Open web browser
2. Enter appropriate `IP` address based on connection method
3. Log in as `Installer`
4. Select `Edit Parameters`

### Modbus Setup

1. Navigate to `Modbus` settings
2. Enable the Modbus feature

### Grid Connection Configuration

For standard models:

1. Go to `System and device control`
2. Find `Grid connection point`
3. Change `Operating mode of active power limitation` to `External`

For `SBx.x-1AV40/41` models:

1. Locate `Operating mode active power setting`
2. Set to `External active power setpoint`

### Finalizing Changes

1. Always click `Save All` after making modifications
2. Wait for changes to be applied

## Testing Connectivity

After enabling Modbus TCP on your SMA inverter, you should verify that the connection is functioning correctly. You can follow our [testing guide](https://github.com/srcfl/egw-getting-started/blob/main/test_con.md) to confirm the connection. For SMA inverters, use the default Modbus port 502. The Unit ID is typically set to 3, which differs from many other manufacturers. Make sure you've completed all the grid connection configuration steps before testing, as these settings can affect Modbus communication.

## Troubleshooting

### Modbus Setting Issues

If unable to change Modbus settings:

1. Contact your installer
2. Check if settings are locked by `SMA Grid Guard`
3. Verify `installer` access rights

### Connection Problems

If experiencing connection issues:

1. Verify correct WiFi network selection
2. Double-check `IP` address
3. Ensure you're within range of the inverter

### Missing Settings

If settings are not visible:

1. Verify your model number
2. Check for alternative setting names
3. Confirm `installer` access level

## Source

- Community
- [SMA Inverter Modbus TCP Configuration Guide](https://villageenergy.zohodesk.com/portal/en/kb/articles/instructions-for-enabling-modbus-tcp-on-sma-inverter-15-11-2023#Preparation_Checklist)
