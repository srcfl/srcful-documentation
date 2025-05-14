---
sidebar_position: 2
slug: /developer/api/authentication
pagination_prev: null
---

# Authentication

Currently, authentication is not required for the majority of calls to the API. This open access model allows developers to quickly explore and integrate with our platform without the initial overhead of authentication setup.

However, please **note** that this authentication model may change in the future. We anticipate implementing access controls where certain data types or high-resolution historical data may require authentication.

The Sourceful API supports several authentication mechanisms, each designed for specific use cases:

| Authentication Type | Purpose |
|---------------------|---------|
| **API Key** | Administrative access for system management |
| **Message Protocol** | The default authentication method for building client-side applications |
| **Signature** | Hardware device authentication |

## API Key
API-key authentication is almost always for Administrative tasks, functions or analytics. As a developer using the API the API-key authentication method is not available.

## Message Protocol

The Sourceful message protocol is heavily inspired by [CAIP-122](https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-122.md) and provides a standardized format for creating messages that will be signed.

**Basic Message Format:**

```
https://srcful.io/ wants you to sign data:
{public key}

{Reason for signing}

Issued At (UTC): {yyyy-MM-ddTHH:mm:ss.fffZ}
Expiration Time (UTC): {yyyy-MM-ddTHH:mm:ss.fffZ}
```

**Extended Message Format with Properties:**

Most operations require additional property data specific to the operation:

```
https://srcful.io/ wants you to sign data:
{public key}

{Reason for signing}

{Property name}: {Property data}
Issued At (UTC): {yyyy-MM-ddTHH:mm:ss.fffZ}
Expiration Time (UTC): {yyyy-MM-ddTHH:mm:ss.fffZ}
```

### Implementation Process:

1. Create the standardized message following the format above
2. Sign the message using an Ed25519 key pair
3. Include both the original message and its signature in your API call

### Example: Gateway Ownership Verification

```
https://srcful.io/ wants you to sign data with your Ed25519 key:
A7E82D76F515F1738C6C7AFA3BFE5A218E246C007F83

Verify ownership of gateways

Gateways: gatewayId1, gatewayId2 
Issued At (UTC): 2025-05-14T14:30:00.000Z
Expiration Time (UTC): 2025-05-14T15:30:00.000Z
```

### Example API Call Using Message Authentication:

```graphql
# Example: Retrieve private data from a gateway using message authentication
query {
  gateway {
    gateway(
      id: "012307e4843d412cee",  # Gateway ID
      auth: {
        message: {
          message: "https://srcful.io/ wants you to sign data with your Ed25519 key:\nA7E82D76F515F9A6BC3F63139904AAB391738C6C7AFA3BFE5A218E246C007F83\n\nGateway Data Access\n\nGateways: 012307e4843d412cee\nIssued At (UTC): 2025-05-14T14:30:00.000Z\nExpiration Time (UTC): 2025-05-14T15:30:00.000Z",
          signature: "base64-encoded-ed25519-signature"
        }
      }
    ) {
      id
      name
      privateData {
        latitude
        longitude
      }
      ders {
        type
        sn
        rawSn  # Only available with authentication
      }
    }
  }
}
```

### Issued At and Expiration Time

Depending on the message the timespan the `Issued At` and `Expiration Time` creates will need to be diffrent. The ownership message that is the most common message used have a maximum lifetime of 365 days.


## Signature

Hardware gateways use JWT (JSON Web Token) for secure device-to-server authentication. The signature is also used in the initialize operation during gateway inception when a gateway has no owner yet. 