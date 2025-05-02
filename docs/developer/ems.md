---
sidebar_position: 5
slug: /developer/ems
pagination_prev: null
---
# Energy Management Systems (EMS)

This document describes basic about the Sourceful - Energy Management Systems (EMS). The focus is on a broader understanding about how the system works and what it can be used for.

The EMS-system is a comprehensive platform designed to monitor, control, and optimize decentralized energy resources (DERs). It enables organizations or individuals to reduce energy costs, improve operational efficiency, and meet sustainability goals through intelligent data analysis and automated energy control functions.

## Basics

At the core of the EMS is the Sourceful Energy Gateway (GW). The GW discovers and establishes connections with Decentralized Energy Resources (DERs) throughout the network, enabling the EMS to implement system-wide optimizations.

Upon activation, the Gateway authenticates with the central EMS platform and awaits operational commands. The EMS system employs device recognition to automatically identify the specific system type or manufacturer of connected DERs, then tailors its command protocols to accommodate the unique technical requirements of each system.

The EMS platform itself functions primarily as an orchestration layer rather than a decision engine. Instead of incorporating internal intelligence, it partners with specialized EMS-Providers who analyze the collected data and execute the optimization strategies.


## Providers

Providers in the EMS system are parties that handle energy optimizations. A Provider has full access to all the energy data collected via the Gateway to make smart decisions. Using this data, Providers can analyze patterns, forecast energy needs, and automatically adjust resources for maximum efficiency and cost savings.

* External parties: Organizations or companies that offer optimization services
* Schema-based: Pre-configured optimization strategies that follow specific patterns 
* User-created: Custom optimization rules defined by the Energy Gateway owners themselves (Not currently available)

Providers utilize the Sourceful GraphQL API to schedule and manage energy operations.

If you want to build a Provider you need to contact Sourceful for authentication and details.

## Example:

Scheduling a battery operation:

```graphql
mutation{
  ems{
    battery{
      schedule(
        sn:"bt-XHnOTKrw6SLw2...fe3F3ziuzOvcR6SF84d7em",
      	executionTime:"2025-05-01T10:00:00"
        operation: CHARGE,
        power: 1000,
        provider: PROVIDER_NAME,
        auth:{
          sign:{
            signature: "signature"
          }
        }
      ){
        scheduleId
        success
      }
    }
  }
}
```
## Parameter Explanation

| Parameter | Description | Example Value |
|-----------|-------------|---------------|
| `sn` | Unique serial number(sn) for the specific DER | `"bt-XHnOTKrw6SLw2...fe3F3ziuzOvcR6SF84d7em"` |
| `executionTime` | ISO 8601 formatted timestamp in UTC when the operation should begin. If you want to control something in realtime set this to the current time in UTC. | `"2025-05-01T10:00:00"` |
| `operation` | The type of operation to perform on the battery. Options: DISCHARGE or CHARGE | `CHARGE` |
| `power` | Power level in watts for the operation | `1000` |
| `provider` | Identifier for the Provider initiating the operation | `PROVIDER_NAME` |
| `auth.sign.signature` | Authentication signature proving the Provider has authorization | `"signature"` |

## Response Parameters

| Parameter | Description |
|-----------|-------------|
| `scheduleId` | Unique identifier for the scheduled operation |
| `success` | Boolean indicating whether the operation was successfully scheduled |


## Beta Deployment Phase

The EMS is currently in a controlled beta deployment phase. During this period, Sourceful selectively connects systems and actively monitors both performance metrics and optimization outcomes. This measured approach allows us to verify system safety protocols and validate the effectiveness of energy management strategies before wider release.