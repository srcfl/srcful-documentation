---
sidebar_position: 5
---

# Troubleshooting

## Energy Gateway

---

### Why Can't I Detect My Inverter During Network Scan?
1. **Are Your Devices on the Same Network?**
   - Verify that your Energy Gateway and inverter are online and connected to the same local network.
2. **Is communication over Modbus TCP activated ?**
   - Some inverter brands allow you to enable Modbus TCP directly through device settings (read inverter manual).
   - For other brands, you may need to contact your local installer to open communication via Modbus TCP for third-party access.
   - If you want to verify that it's activated, we've created a simple guide that you can access 
    <a class="button button--primary" href="https://github.com/srcfl/egw-getting-started/blob/main/test_con.md">Read the guide</a>

3. **Have you tried power cycling both the Energy Gateway and inverter?**
   - Unplug both devices, wait 30 seconds, then reconnect them (inverter first, then gateway).
4. **Running the latest firmware versions?**
   - For the Energy Gateway:
     1. Ensure the device is connected to your network via Ethernet cable
     2. Restart the gateway
     3. Wait for approximately 10 minutes
     4. The gateway will automatically download and install the latest firmware
    
---

### How do I know if Modbus TCP is activated on my inverter?
Start by reading your inverter's manual to check if it supports Modbus TCP communication. You can also call your local installer to ask. Typically, the installer has the authorization to activate Modbus TCP if you have an inverter that supports it. If you want to verify that it's activated, we've created a simple guide that you can access 

<a class="button button--primary" href="https://github.com/srcfl/egw-getting-started/blob/main/test_con.md">Read the guide</a>

---

### How to setup a Solana wallet (like Phantom) and use for gateway onboarding?

#### Video instruction
<iframe width="560" height="315" src="https://www.youtube.com/embed/5G5H3nmAgwM?si=zn74TWmNqChvup_k" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Setting up a Solana wallet is a simple process that can be completed in a few steps:

1. **Choose a wallet provider:** There are several wallet providers that support Solana, including Phantom (preferred) and Solflare. Available as an app for iPhone and Android, plus browser extensions for popular browsers like Chrome. Then follow their instructions for creating a new wallet.

2. **Create a new wallet:** Once you've chosen a wallet provider, follow the instructions to create a new wallet. You'll be asked to choose a secure password and seed phrase, which you have to save and keep in a safe place. **Sourceful will never ask you for your seed phrase or password!**

3. **Link your wallet to Sourceful:** During the Energy Gateway setup process in the app, you'll be prompted to link your Solana wallet. Look for the wallet icon at the beginning of the onboarding process.
