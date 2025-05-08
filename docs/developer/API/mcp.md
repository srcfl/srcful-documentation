---
sidebar_position: 2
slug: /developer/mcp-ai
title: MCP Integration (AI)
---

# MCP Integration for Sourceful GraphQL API

## Overview

Model Control Protocol (MCP) provides a standardized interface enabling AI assistants to interact securely with the Sourceful GraphQL API. This integration allows users to query energy data using natural language, eliminating the need to manually write GraphQL queries.

MCP serves as both an efficient way to access your data and an educational tool for understanding the API's capabilities.

**Note:** Currently, this integration is compatible exclusively with Claude AI through the Desktop application.

## Installation

To implement the MCP server:

1. Install Claude Desktop application
2. Follow the [official MCP installation guide](https://modelcontextprotocol.io/quickstart/user)
3. Use the following configuration instead of the default:

```json
{
  "mcpServers": {
    "sourceful-api": {
      "command": "npx",
      "args": ["mcp-graphql"],
      "env": {
        "ENDPOINT": "https://api.srcful.dev/mcp",
        "NAME": "Sourceful API"
      }
    }
  }
}
```

**Important:** Restart the application after modifying the configuration file to apply changes.

## Implementation

Once configured, the MCP integration enables:

- Translation of natural language requests into appropriate GraphQL queries
- Secure execution of those queries against the Sourceful API
- Return of formatted results in a conversational context

## Example Queries

### Basic Data Retrieval
```
Show me the current solar production for gateway 01233d032a7c838bee.
```

### Historical Analysis
```
Compare the battery state of charge between May 1 and May 4, 2025 for gateway
01233d032a7c838bee. Display data in 1-hour intervals.
```

### Energy Consumption Patterns
```
Analyze the energy consumption of DER em-LbRKeSP5xXYCnD2s3fyAXAZ8vW6DbZ8YoiR1C5OZt48O8Moe6nIuVqIpJ 
from May 1 to May 2, 2025. Provide insights on phase power distribution.
```

## Technical Process

The MCP integration follows this workflow:

1. The AI interprets natural language requests
2. Requests are translated into valid GraphQL queries using API introspection
3. MCP securely executes the queries against the Sourceful API endpoint
4. Results are formatted and presented with appropriate context and explanations

This streamlined process eliminates technical barriers to accessing your energy data, making it accessible through natural conversation.