---
sidebar_position: 1
slug: /developer/
---

# API Documentation

## Overview
The Sourceful GraphQL API provides access to production data from various energy assets. It is designed to be flexible, allowing users to query the data in various resolutions and time frames. This documentation explains how to interact with the API using GraphQL.

### API Playground
For testing and experimenting with queries, you can visit the [API Playground](https://api.srcful.dev/playground). This tool allows you to execute queries interactively and inspect results, making it easier to translate queries into your application code.

### API Endpoint
**Base URL**: `https://api.srcful.dev/`

## Authentication
Currently, authentication is not required for basic access, but we plan to add authentication mechanisms in future iterations.

## Querying the API
The API uses GraphQL, a powerful query language for APIs that allows clients to specify exactly what data they need.

### Example Query: Fetching Production Data

Below is an example of how to fetch production data using Python with the `gql` library. The query retrieves power data for a given asset over a specific time range.

```python
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

# Define the GraphQL query as a string
query = gql("""
query get_some_data {
  proofOfSource(id:"01234bdcfdad2fa4ee") {
    histogram(start:"2024-10-01T00:00:00.000Z", stop: "2024-10-07T00:00:00.000Z", resolution:"1h") {
      when
      power
    }
  }
}
""")

# Set up the GraphQL client
transport = RequestsHTTPTransport(url='https://api.srcful.dev/')
client = Client(transport=transport, fetch_schema_from_transport=True)

# Execute the query
try:
    result = client.execute(query)
    print(result)
except Exception as e:
    print(f"An error occurred: {e}")
