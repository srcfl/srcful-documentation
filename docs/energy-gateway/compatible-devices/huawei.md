# Huawei

The following guide describes how to configure the `Modbus TCP` settings for Huawei inverters and how to test the connection.

## Prerequisites

### Hardware Requirements

- Mobile device with `Android 4.0` or later
- Huawei `SDongle`
- Internet connectivity
- `WiFi` capability

### Software Requirements

- `SUN2000` App (version `3.2.00.015` or later)
- Available from `Huawei AppGallery`

## Configuration Process

### Initial Setup

1. Install `SUN2000` App from `Huawei AppGallery`
2. Ensure `SDongle` remains powered throughout configuration

### Connection Setup

1. Open `SUN2000` App
2. Select `Connect` → `WLAN`
3. Choose inverter's WiFi network
4. Enter password:
   - First login: `Changeme`
   - Change password after initial login

### Modbus Configuration

1. Login as installer (default password: `00000a`)
2. Navigate to: `Settings` → `Communication Configuration` → `Dongle Parameter Settings` → `Modbus-TCP`
3. Select appropriate access mode:
   - `Unrestricted`: Allows all LAN devices (one at a time)
   - `Restricted`: Requires setting trusted IP address
   - `Disabled`: No Modbus access

## Important Notes

- Configuration settings persist through power cycles
- New inverters require fresh configuration
- `SDongle` replacement doesn't require reconfiguration
- Keep `SDongle` powered during configuration process

## Testing Connectivity

Once you've configured Modbus TCP on your Huawei inverter, it's essential to verify that the connection is working correctly. You can follow our [testing guide](https://github.com/srcfl/egw-getting-started/blob/main/test_con.md) to confirm the connection. For Huawei inverters, note that the default Modbus port is 6607, which differs from the standard Modbus port. The Unit ID is typically set to 1. If you've enabled the restricted access mode, make sure you're testing from an allowed IP address.

## Troubleshooting

### Missing Modbus Options

If Modbus settings are not visible:

1. Check firmware versions
2. Update app if necessary
3. Verify `SDongle` compatibility

### Connection Problems

If unable to connect:

1. Ensure `SDongle` is powered
2. Stay within WiFi range
3. Verify correct password

### Access Issues

If experiencing access problems:

1. Check IP restrictions if enabled
2. Verify only one client is connecting
3. Confirm network settings are correct

## Source

- Community
- [Huawei Inverter Modbus TCP Configuration Guide](https://forum.huawei.com/enterprise/intl/en/thread/modbus-tcp-guide/667250677153415168?blogId=667250677153415168)
