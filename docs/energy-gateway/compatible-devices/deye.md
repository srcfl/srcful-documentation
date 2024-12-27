# Deye

The following guide describes how to configure the `Modbus TCP` settings for Deye inverters and how to test the connection.

## Prerequisites

- Compatible with `SUN-G3-EU-230` Series (300W to 2000W models)
- Network scanning tool (e.g., `Advanced IP Scanner`)
- Web browser
- Network connectivity

## Configuration Process

### Locating Your Inverter

1. Choose one of these methods:
   - Use your router's interface
   - Use `Advanced IP Scanner` to identify inverter `IP`

### Accessing Settings

1. Enter inverter `IP` in browser
2. Login with default credentials:
   - Username: `admin`
   - Password: `admin`
3. Modify URL to: `http://<ipaddress>/config_hide.html`

### Modbus Configuration

Configure "Internal server parameters settings":

1. Set Protocol to `TCP-Server`
2. Set Port to `8899`
3. Enter your server `IP` address
4. Set TCP timeout to `300`

## Testing Connectivity

After completing the configuration, you should verify that the Modbus TCP connection is working properly. Follow our [testing guide](https://github.com/srcfl/egw-getting-started/blob/main/test_con.md) to confirm the connection. For Deye inverters, remember to use port 8899 when testing the connection. The Unit ID is typically set to 1, but you may need to try 0 if that doesn't work.

## Troubleshooting

### Inverter Discovery Issues

If you cannot find your inverter:

1. Verify inverter power status
2. Check network connectivity
3. Try alternative network scanning tools

### Settings Problems

If settings are not saving:

1. Confirm you're using the `config_hide.html` URL
2. Clear browser cache and retry
3. Verify `admin` access rights

### Modbus Connection Issues

If Modbus is not working:

1. Verify port `8899` is accessible
2. Check server address accuracy
3. Test using `Modbus` diagnostic tool

## Source

- Community
