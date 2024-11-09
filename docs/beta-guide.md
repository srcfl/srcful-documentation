---
sidebar_label: "Setup Guide: Dual Mining Beta"
sidebar_position: 1
sidebar_class_name: item1
---

# Setup Guide: Dual Mining

:::warningImportant
If you are flashing a **RAK V2** originally purchased as a **Helium Hotspot**, you must provide us with the Serial ID and Public Key of your Energy Gateway once you have flashed the Dual Mining image. You can find both of these in the [**Configurator**](https://app.srcful.io) once you have flashed the image **as per the instructions below**.

Please open a ticket on our Discord or send an email to **joakim@sourceful-labs.com** to have your Energy Gateway onboarded.

**NOTE:** This does **not** apply to those who have purchased a **Sourceful Dual Miner** from RAK.
:::

## Srcful Gateway: Flashing and Firmware Update Guide

This guide will walk you through the process of flashing your Srcful Gateway SD card with the appropriate firmware.

## Prerequisites

:::info
Registered DIY gateways can also be flashed with this firmware.
:::

- Pre-registered Srcful Gateway (all purchased gateways are pre-registered) or registered in the beta-program for dual-mining.
- Computer with an SD card reader or an SD card reader USB adapter
- SD card (32GB or larger)
- [BalenaEtcher](https://www.balena.io/etcher/) installed on your computer

## Download Firmware

The firmware image can be downloaded from [this link](https://drive.google.com/file/d/1Jv1jPbNRn3IJghMI1Bg4wdSl4eNz-soD/view?usp=sharing).

## Step-by-Step Flashing Guide

### 1. Download Firmware

📥 Download the firmware image from the link above.

### 2. Prepare SD Card

💾 Insert your SD card (32GB or larger) into your computer.

### 3. Flash Firmware

:::warning
Remember to back up your SD card before flashing new firmware!
:::

1. Open **BalenaEtcher**
2. Click "**Flash from file**" and select your downloaded firmware image
3. Click "**Select target**" and choose your SD card
4. Click "**Flash!**" and wait for the process to complete
5. Once flashing is complete, safely eject the SD card from your computer

### 4. Insert SD Card and Boot

Insert the flashed SD card into your Srcful gateway. Connect the gateway to your network using an ethernet cable, then power it on. The ethernet connection is necessary for the gateway to pull the latest firmware updates.

⚠️ **Wait approximately 15 minutes for the gateway to complete its initial boot and update process.**

### 5. Onboard your Energy Gateway on the Helium Network (optional)

If your **Dual Mining Energy Gateway** has not yet been onboarded to the Helium Network, download the Helium Wallet app and follow the steps to onboard your Energy Gateway.
<br/>
<a class="button button--primary" href="https://apps.apple.com/se/app/helium-wallet/id1609525848?l=en-GB ">Helium Wallet for iPhone</a>

<a class="button button--primary" href="https://play.google.com/store/apps/details?id=com.helium.wallet.app" style= {{marginLeft: '50px'}}>Helium Wallet for Android</a>

## Troubleshooting

If you encounter any issues during the flashing process or while setting up your Srcful Gateway, please don't hesitate to reach out for support. Our community is here to help!

For assistance, join our Discord community: [https://discord.gg/srcful](https://discord.gg/srcful)

Our team and community members will be happy to help you resolve any problems you may encounter.
