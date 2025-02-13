---
sidebar_position: 1
slug: /developer/hardware
pagination_prev: null
---

# Hardware Guide
This document describes basic requirements for a device to be compatible with the Sourceful Energy Network (SEN). The focus is for firmware compatibility. Document is under development.

While there are many types of devices that can be connected to the SEN they are all regarded as gateways in the SEN, the gateway is then responsible for collecting data and controlling one or several energy resources. Some gateways are more special e.g. a p1 meter and some are more generic in nature e.g. the Sourceful Energy Gateway.

The firmware for the Sourceful Energy Gateway is open source and can serve as a generic reference implementation: https://github.com/srcfl/srcful-gateway/

## Basics
A gateway needs to be identifiable and provide a public key. Gateway id and public key needs to be registered with SEN before the gateway is usable. Internally a gateway needs to maintain the private key and sign data.

All hardware devices will need to be audited and tested before a granted access to the network and public release.

# Cryptographic Implementation Guide

## Overview
The SEN uses ECDSA (Elliptic Curve Digital Signature Algorithm) for cryptographic operations, implemented in two ways:
1. Hardware-based using ATECC608A/B secure elements
2. Software-based e.g. using Python's `ecdsa` library

## Core Specifications
- **Algorithm**: ECDSA
- **Curve**: SECP256r1 
- **Key Sizes**: 
  - Private Key: 32 bytes (256 bits)
  - Public Key: 64 bytes (x,y coordinates, 32 bytes each)


## Software Implementation
If a software keys are used it is imperative that the private key is stored in a secure way. The private key must not be stored in plain text in files, code nor as environment variables.
### Python Example
```python
mport json
import base64
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import ec, utils

def base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')

# Generate a new private key
private_key = ec.generate_private_key(ec.SECP256R1())
public_key = private_key.public_key()

# Get the private key number
private_numbers = private_key.private_numbers()
private_key_hex = f"{private_numbers.private_value:064x}"
print(f"Private key: {private_key_hex}")

# Get the public key coordinates
public_numbers = public_key.public_numbers()
public_key_hex = f"{public_numbers.x:064x}{public_numbers.y:064x}"
print(f"Public key: {public_key_hex}")

# Create a JWT
header = {
    "alg": "ES256",
    "typ": "JWT",
    "device": "test123",
    "opr": "testing"
}

payload = {
    "message": "Hello, World!",
    "timestamp": 1234567890
}

# Encode header and payload
header_b64 = base64url_encode(json.dumps(header).encode())
payload_b64 = base64url_encode(json.dumps(payload).encode())

# Create message to sign
message = f"{header_b64}.{payload_b64}".encode()

# Hash the message
digest = hashes.Hash(hashes.SHA256())
digest.update(message)
message_hash = digest.finalize()

# Sign the message
signature = private_key.sign(
    message_hash,
    ec.ECDSA(utils.Prehashed(hashes.SHA256()))
)

# Convert DER signature to raw R,S format
r, s = utils.decode_dss_signature(signature)
signature_bytes = r.to_bytes(32, byteorder='big') + s.to_bytes(32, byteorder='big')
signature_b64 = base64url_encode(signature_bytes)

# Create final JWT
jwt = f"{header_b64}.{payload_b64}.{signature_b64}"
print(f"\nGenerated JWT:\n{jwt}")
```

## SEN Onboarding
Before a gateway is usable on the SEN it must be tied to a wallet public key (inception), eg. the users wallet, and get a correct physical location.

### Inception
The gateway must accept the wallet public key and add its own id and a cryptographic signature. the gateway then initializes the device in the SEN API.

When the gateway is tied to a wallet further calls to the SEN API will fail. 

```grapql
mutation {
      gatewayInception {
        initialize(gatewayInitialization:{idAndWallet:"gateway_id:wallet_public_key", signature:"signature_of_idAndWallet"}) {
          initialized
        }
      }
    }
```

### Location
The location for a gatway is important from a validity standppint. The netwok relies on accurate positions of resources, to e.g. know that a resource is part of a particular area.

Setting the location for a gatway is based on a signature from the owning wallet (see Inception above). The gateway hardware/keys are not part of this, and this part can thus be handled in different ways. The Sourceful Energy App offer setting the location of a device for all gateways a wallet has been paired with.

## User Experience
The user experience of onboarding can vary depending on the level of integration desired. Basically it is up to each gateway firmware to provde the means for:

1. Network connectivity - most devices would need some kind of network access e.g. wifi credentials.
2. Inception
3. Location (Optional)

### Local Interface
This in the simplest form this is handled via the gateway itself, via a local interface e.g. an internal webpage. This may be sufficient for a deeply technical product, possibly with other complex configuration of connected devices etc. The main caveat for a unified user experience in this case is the integration of the wallet key. There are however modules for most popular web frameworks that can handle this seamlessly. In the simplest case the user will need to copy paste the wallet public key into the local interface. Depending on needs the local interface can be as advanced as needed and provide a full user experience by utilizing the data egress of the SEN network to do visualizations etc.

### Bespoke App
For a more non-technical user experience a bespoke app that communicates with the gatweway may be developed.

### Sourceful Energy App
The onboarding may be integrated into the Sourceful Energy App (SEA) for a seamless experience into the network. Using the SEA the user can always set location of an owned gateway. The SEA also offers network connectivity, and inception integration of the gateway, but this requires additional functionality in the gateway firmware.

### Network Connectivity
TODO: Describe the how wifi can be provisioned in the app, e.g. qr code, default network ssid, and/or ble?

## Inception
The gateway should expose a REST endpoint that accepts the wallet public key. This endpoint should be accessible via ble or local network access via mdns.

```
POST api/initialize
{
  "wallet":"public_key"
}
```

# SEN Data Ingress
Devices send data to the SEN using a signed JSON Web token (jwt) format. You can read more about the format specification here: https://jwt.io/introduction, frequency of sending is 10 seconds, but may be more seldom. 

In particular data is ingested using signed JWTs (not encrypted) via https. I.e. standard safe https transport is used to perform end to end encryption of the data.

## header
The header consists of the standard fields plus extra protocol specific fields.

```json
{
    "alg": "ES256",    
    "typ": "JWT",
    "device": "device_id",
    "opr": "testing"
    "licence": "device licence key"
    "developer": "developer licence key"
    "model": "model string"
    "dtype": "payload datatype specifics",
    "sn": "data serial number"
    
}
```

### energy meter header example

```json
{
  "alg": "ES256",
  "typ": "JWT",
  "device": "0123752ceb741f6eee",
  "opr": "production",
  "model": "p1homewizard",
  "dtype": "p1_telnet_json",
  "sn": "LGF5E360"
}
```

One note is that technically the `ES256K` algorithim is used. that is ECDSA using SECP256k1 curve and SHA-256 and not ECDSA using P-256 curve and SHA-256

## payload
The body consists of the data the device sends, this data consists of one or more timestamped json objects. This is not generally standardized at this point. Timestamps are always in UTC.

### energy meter payload example

```json
{
  "1739352916813": {
    "serial_number": "LGF5E360",
    "rows": [
      "0-0:1.0.0(250212103510W)",
      "1-0:1.8.0(00010968.132*kWh)",
      "1-0:2.8.0(00000000.000*kWh)",
      "1-0:3.8.0(00000005.151*kVArh)",
      "1-0:4.8.0(00002109.781*kVArh)",
      "1-0:1.7.0(0000.253*kW)",
      "1-0:2.7.0(0000.000*kW)",
      "1-0:3.7.0(0000.000*kVAr)",
      "1-0:4.7.0(0000.084*kVAr)",
      "1-0:21.7.0(0000.064*kW)",
      "1-0:22.7.0(0000.000*kW)",
      "1-0:41.7.0(0000.161*kW)",
      "1-0:42.7.0(0000.000*kW)",
      "1-0:61.7.0(0000.028*kW)",
      "1-0:62.7.0(0000.000*kW)",
      "1-0:23.7.0(0000.000*kVAr)",
      "1-0:24.7.0(0000.000*kVAr)",
      "1-0:43.7.0(0000.000*kVAr)",
      "1-0:44.7.0(0000.052*kVAr)",
      "1-0:63.7.0(0000.000*kVAr)",
      "1-0:64.7.0(0000.032*kVAr)",
      "1-0:32.7.0(233.6*V)",
      "1-0:52.7.0(233.0*V)",
      "1-0:72.7.0(232.9*V)",
      "1-0:31.7.0(000.2*A)",
      "1-0:51.7.0(000.7*A)",
      "1-0:71.7.0(000.1*A)",
      "!0E78"
    ],
    "checksum": "0E78"
  }
}
```


## signature
The signature is the signature generated by the device private key that can be verified by the public key.

### Full signed jwt energy meter example
```
eyJhbGciOiAiRVMyNTYiLCAidHlwIjogIkpXVCIsICJkZXZpY2UiOiAiMDEyMzc1MmNlYjc0MWY2ZWVlIiwgIm9wciI6ICJwcm9kdWN0aW9uIiwgIm1vZGVsIjogInAxaG9tZXdpemFyZCIsICJkdHlwZSI6ICJwMV90ZWxuZXRfanNvbiIsICJzbiI6ICJMR0Y1RTM2MCJ9.eyIxNzM5MzUyOTE2ODEzIjogeyJzZXJpYWxfbnVtYmVyIjogIkxHRjVFMzYwIiwgInJvd3MiOiBbIjAtMDoxLjAuMCgyNTAyMTIxMDM1MTBXKSIsICIxLTA6MS44LjAoMDAwMTA5NjguMTMyKmtXaCkiLCAiMS0wOjIuOC4wKDAwMDAwMDAwLjAwMCprV2gpIiwgIjEtMDozLjguMCgwMDAwMDAwNS4xNTEqa1ZBcmgpIiwgIjEtMDo0LjguMCgwMDAwMjEwOS43ODEqa1ZBcmgpIiwgIjEtMDoxLjcuMCgwMDAwLjI1MyprVykiLCAiMS0wOjIuNy4wKDAwMDAuMDAwKmtXKSIsICIxLTA6My43LjAoMDAwMC4wMDAqa1ZBcikiLCAiMS0wOjQuNy4wKDAwMDAuMDg0KmtWQXIpIiwgIjEtMDoyMS43LjAoMDAwMC4wNjQqa1cpIiwgIjEtMDoyMi43LjAoMDAwMC4wMDAqa1cpIiwgIjEtMDo0MS43LjAoMDAwMC4xNjEqa1cpIiwgIjEtMDo0Mi43LjAoMDAwMC4wMDAqa1cpIiwgIjEtMDo2MS43LjAoMDAwMC4wMjgqa1cpIiwgIjEtMDo2Mi43LjAoMDAwMC4wMDAqa1cpIiwgIjEtMDoyMy43LjAoMDAwMC4wMDAqa1ZBcikiLCAiMS0wOjI0LjcuMCgwMDAwLjAwMCprVkFyKSIsICIxLTA6NDMuNy4wKDAwMDAuMDAwKmtWQXIpIiwgIjEtMDo0NC43LjAoMDAwMC4wNTIqa1ZBcikiLCAiMS0wOjYzLjcuMCgwMDAwLjAwMCprVkFyKSIsICIxLTA6NjQuNy4wKDAwMDAuMDMyKmtWQXIpIiwgIjEtMDozMi43LjAoMjMzLjYqVikiLCAiMS0wOjUyLjcuMCgyMzMuMCpWKSIsICIxLTA6NzIuNy4wKDIzMi45KlYpIiwgIjEtMDozMS43LjAoMDAwLjIqQSkiLCAiMS0wOjUxLjcuMCgwMDAuNypBKSIsICIxLTA6NzEuNy4wKDAwMC4xKkEpIiwgIiEwRTc4Il0sICJjaGVja3N1bSI6ICIwRTc4In19.F_qZ21yRA3CPLhFYPojJ0mHA9NI5pdMOdQ5bdk35ENh3dkyA14S9UqILK8KhZVxeegfQSGjS5gHle3BKBm14cw
```
