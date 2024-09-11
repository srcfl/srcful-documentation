# SolarEdge

:::info
**Does your model support read? **

Keep in mind that you must ensure that communication via Modbus TCP
IP is enabled on your inverter. Refer to your inverter manual or contact your installer to confirm this first. 
:::

- ✅ - Supported
- ❌ - Not Supported
- 🔜 - To be evaluated

| Model      | Read       | Control    |
| ---------- |:----------:|:----------:|
| SE3000H-US | ✅         | 🔜         | 
| SE3800H-US | ✅         | 🔜         |
| SE5000H-US | ✅         | 🔜         |
| SE5700H-US | ✅         | 🔜         |
| SE6000H-US | ✅         | 🔜         |
| SE7600H-US | ✅         | 🔜         |
| SE10000H-US | ✅         | 🔜         |
| SE11400H-US | ✅         | 🔜         |


### Enabling Modbus TCP

1. Ensure the inverter is connected to your network either via Ethernet or Wifi
1. Locate the on/off switch on the inverter (usually has a red cap, near the bottom left of the inverter)
1. Push the switch to the left (P) for 1 second, then release
1. Scan the QR code on the right side of the inverter with your phone camera and connect to the WiFi network indicated by the code
    - **Note**: You may get a notification that the network not having internet access. If this happens, select "Use network anyways"
1. Open a web browser and navigate to http://172.16.0.1/
1. Under "Communication Settings" enable the Modbus TCP option and make note of the port shown (usually 502 or 1502)