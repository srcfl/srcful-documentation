---
sidebar_position: 2
slug: /developer/mcp-ai
title: MCP Integration (AI)
---

# MCP Integration for Sourceful GraphQL API

## What is MCP?

MCP (Model Control Protocol) is a standardized interface that allows AI assistants to interact with external services and APIs in a secure, controlled manner. For the Sourceful API, MCP provides a seamless way to query your energy data using natural language instead of writing GraphQL queries manually.
It's also a great way to learn about the API and how it can be utilized.

At the time of writing this only works using Claude.

### Installation

To use the MCP server you at the time of writing you most use Claude and and the Desktop version.

Follow this installation guide but use the configuration below instead:  [Installation guide](https://modelcontextprotocol.io/quickstart/user)



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

Remember that after modifing the configuration file the application needs to be restarted.

## Using MCP with AI Assistants

Once you've configured MCP, you can use it with query your energy data using natural language. The AI will automatically translate your requests into the appropriate GraphQL queries.


## Example Prompts for AI Assistants

Here are some example prompts you can use with an AI assistant that's connected to the Sourceful API via MCP:

### Basic Data Retrieval

```
Show me the current solar production for gateway 01233d032a7c838bee.
```

### Historical Analysis

```
Compare the battery state of charge between May 1th and May 4th, 2025 for gateway
01233d032a7c838bee. Show me the data in 1-hour intervals.
```

### Energy Consumption Patterns

```
Analyse the energy consumption of the DER em-LbRKeSP5xXYCnD2s3fyAXAZ8vW6DbZ8YoiR1C5OZt48O8Moe6nIuVqIpJ 
from May 1th and May 2th, 2025. Try to come to cocuconclusions about the phase power distrubution.
```

## How It Works

When you send a prompt to an AI assistant with MCP access:

1. The AI interprets your natural language request
2. It translates your request into a valid GraphQL using a Introspection query for the Sourceful API
3. MCP executes the query and returns the data to the AI
4. The AI formats and explains the results in a human-readable way

This process eliminates the need to write complex GraphQL queries yourself and makes your energy data accessible through conversation.
