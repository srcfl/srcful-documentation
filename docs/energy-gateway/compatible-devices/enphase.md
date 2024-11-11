# Enphase

There are two ways to configure the Sourceful Energy Gateway to work with Enphase devices. Either using `Enphase credentials` or using an `Enphase Access Token`.

## Enphase Credentials

To onboard your Enphase using credentials, provide your Enphase `username`, `password`, and IQ Gateway `serial number` in the [**Configurator**](https://app.srcful.io). These credentials are only used once to generate an Access Token for authentication. For security, we do not store your credentials - only the generated Access Token is saved.

## Enphase Access Token

To onboard your Enphase, you need to generate an API token. You can generate a token by:

1. Navigating to the [Enphase Portal](https://entrez.enphaseenergy.com/)
2. Login with your Enphase account credentials
3. Select "Authenticate for commissioned gateway"
4. Under "Select System", begin writing the name the IQ gateway has been commissioned for under and select the gateway from the dropdown
5. Under "Select Gateway", select the IQ gateway you'd like to use from the dropdown menu
6. Click on "Generate Access Token"
7. Copy the token to your clipboard

## Access Token Expiration

Enphase Access Tokens expire after 12 months for homeowner accounts and 12 hours for installer accounts. Make sure to generate a token using the System Owner account to get the longest expiry time (12 months).
