# Modbus TCP Configuration - Fronius Inverters

Fronius inverters can be configured for `Modbus TCP` in two different ways, depending on your model. This guide covers both standard Fronius inverters with `Datalogger` and `GEN24` models.

## Prerequisites

Access level requirements vary by model:

- Standard Fronius with `Datalogger`: `Admin` credentials
- `GEN24`: `Technician` account or `Customer` account with support assistance
- Network connectivity
- Web browser

## Configuration for Standard Fronius with Datalogger

### Initial Connection

1. Connect to inverter's WiFi access point:
   - Locate network name containing `Datalogger ID` (240.xxxxx or 239)
   - Use default WiFi password: `12345678`
   - Access web interface at `192.168.250.181` (or assigned IP)

### Modbus Configuration

1. Log in with `Admin` credentials
2. Navigate to `Modbus` settings
3. Configure the following:
   - Set "Data export via Modbus" to `tcp`
   - Change "Sunspec Model type" to `float`
4. Save configuration

### Control Priority Setup

1. Access `DNO Editor`
2. Set "Controlling via Modbus" to priority 1
3. Adjust priority order if needed
4. Save changes

## Configuration for GEN24 Series

### Initial Access Setup

1. Connect to inverter WiFi (password: `12345678`)
2. Navigate to `192.168.250.181`
3. Access `System` → `Support`
4. Enable both:
   - `Remote Access`
   - `Support User`

### Modbus Configuration (Technician Access)

1. Navigate to `Communication` → `Modbus`
2. Enable "Control via Modbus TCP"
3. Set "SunSpec Model Type" to `float`
4. Enable "Allow Control"

### Control Priority Setup

1. Access `Safety and Grid Regulations`
2. Set `Modbus Control` to highest priority
3. Save all changes

## Important Notes

- Password management varies by model type
- Multiple inverters require individual configuration
- Document settings for each unit

## Testing Connectivity

After configuring Modbus TCP on your Fronius inverter, it's important to verify that the connection is working properly. You can follow our [testing guide](https://github.com/srcfl/egw-getting-started/blob/main/test_con.md) to confirm the connection. For Fronius inverters, use the default Modbus port 502. The Unit ID is typically set to 1, but you might need to check your specific configuration if this doesn't work. Remember that both standard and GEN24 models use the same Modbus TCP port and Unit ID conventions.

## Troubleshooting

### Access Issues

For login problems:

1. Contact support with model and serial numbers for password resets
2. Verify network settings
3. Double-check IP addresses

### Configuration Problems

If experiencing issues:

1. For `GEN24` models, consult installer or Fronius support
2. Verify all settings are saved properly
3. Check network connectivity

## Source

- Community
- [Fronius Inverter Modbus TCP Configuration Guide](https://villageenergy.zohodesk.com/portal/en/kb/articles/enable-modbus-tcp-on-your-fronius-inverter#1_Connect_to_your_Inverters_interface)
