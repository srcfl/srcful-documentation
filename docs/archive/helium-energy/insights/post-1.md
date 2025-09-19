---
sidebar_position: 2
---

# Frequency Containment Reserve Markets

In [HIP 128: Energy Subnetwork](https://github.com/helium/HIP/blob/main/0128-energy-subnetwork.md), we propose using the Energy Network as a mean to connect many small homeowner DERs into one or many VPPs to unlock new markets not accessible to small actors. This HIP-comment will deep dive into the legal and regulatory state with a focus on Europe. Europe is the market we know but it is our firm belief that similar regulations are in place, or will come into place, on other markets as well (this post will be updated with more markets at a later stage). 

### Understanding Frequency Containment Reserves (FCR) in Europe

Frequency Containment Reserves (FCR) are a fundamental part of maintaining the stability and reliability of Europe's electricity grid. These reserves ensure that the delicate balance between electricity production and consumption is maintained every second. 

Let's dive into how FCR operates in Europe, its growing importance, and why legal frameworks and organizations like [ENTSO-E](https://www.entsoe.eu/) are vital to this process.

### The Essential Role of FCR

Imagine the European electricity grid as a perfectly tuned orchestra. If one instrument goes out of sync, the harmony is disrupted. FCR acts as the conductor, ensuring every part of the grid performs in harmony, keeping the frequency close to the ideal 50 Hz. This precise frequency control prevents power outages and equipment damage. You can monitor this is in real time at for instance the [“Control room” of Svenska Kraftnät](https://www.svk.se/en/national-grid/the-control-room/), the TSO of Sweden.

### How FCR Works in Europe

European countries ([36 countries as of July 2024](https://www.entsoe.eu/about/inside-entsoe/members/)) collaborate closely to manage FCR. Transmission system operators (TSOs) across Europe, coordinated by the European Network of Transmission System Operators for Electricity ([ENTSO-E](https://www.entsoe.eu/)), work together to ensure sufficient reserves are available to counteract any sudden frequency changes.

### Key Features of FCR:

1. **Rapid Response:** FCR must activate within seconds to address frequency deviations swiftly.
2. **Distributed Resources:** While traditionally provided by large power plants, FCR now increasingly comes from decentralized sources like battery storage systems.
3. **Market-Based Procurement:** TSOs procure FCR through competitive markets, ensuring cost-effective and reliable resources are used.
4. **Upwards and Downwards:** 
    Upward FCR: Activated when the frequency is too low and the grid need to have additional power injected.
    Downward FCR: Activated when the frequency is too high and the grid need to have less power injected. Typical at windy clear days when there is a lot of power generation from wind and solar.


### How in practice?

As a distributed energy resource (DER), such as a battery or solar PV system, you earn payments every hour simply for being available as a backup, even if you are not frequently called upon to provide support. When activated, it is typically for short durations to help stabilize the grid (typically seconds up to 15 minutes). On the market for small DERs it is not duration that is most important, it is speed of activation (typically seconds or lower).

***For solar PV systems***, this backup role does not interfere with your regular activities of selling energy back to the grid or using it for your own consumption more than marginally. This dual role enhances your revenue without compromising your primary function. But solar PV systems can only act on downward FCR, curtailing power when the sun shines limiting the utility to fewer hours a day when the sun shines. 

***For batteries***, a portion (typically 50 % - 100 % of the capacity)  of the battery will  be reserved and need to have a state of charge of ~50 % to participate. Batteries can act on both upward and downward FCR. Injecting power to the grid if the frequency is too low or receiving power if the frequency is too high. Being able to participate in both markets makes batteries more useful for the grid thus a larger revenue to the owner of the DER, however, the part of the battery that is reserved for FCR can not be used for doing energy arbitrage at the same time.

### Bidding

To participate in bidding DERs onto the FCR markets, you must be a Balance Responsible Party (BRP). Soon, a new role called Balance Service Provider (BSP) will be introduced with a sole focus on grid balance. BRPs/BSPs have agreements with Technical Aggregators, like Sourceful (referred to as Service Provider in the HIP), to ensure they have the necessary resources to bid in the FCR markets. These actors typically take a percentage of the revenue as part of their business model. The remaining income is passed on to the Technical Aggregator to distribute at will to DER owners (DER Host). 
As an example, [here are BRPs registered at TenneT](https://www.tennet.eu/markets/balansverantwoordelijken-brps/brp-registry), one of Germanys TSOs. 

### Pricing

Pricing on these markets are volatile and their prices are determined by the open market marginal pricing each hour, depending on the supply size and the minimum bids allowed by the resources comprising the supply.

As a reference, 1MW of controllable power from batteries that can work on both upwards and downwards FCR is worth about €1000 for each day. Solar PVs on the other hand is only available a few hours a day, and can only work on downwards FCR is valued at around €100 a day. Note that these numbers are just examples. The real price fluctuates a lot.

**Examples:**

* [Fingrid FCR historical pricing data](https://www.fingrid.fi/en/electricity-market-information/reserve-market-information/frequency-controlled-disturbance-reserve/) (Finland)
* [Historical pricing](https://mimer.svk.se/PrimaryRegulation/PrimaryRegulationIndex) (Sweden and Denmark)


### Legal Frameworks and the Need for FCR

The integration of FCR into the energy market is not just a technical necessity but also a legal requirement. The [European Union's Clean Energy for All Europeans package](https://energy.ec.europa.eu/topics/energy-strategy/clean-energy-all-europeans-package_en) emphasizes the importance of grid stability and the integration of renewable energy resources. Regulations such as [Regulation (EU) 2019/943](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019R0943) on the internal market for electricity highlight the need for balancing services like FCR to ensure the secure operation of the electricity grid.

### The Role of ENTSO-E

[ENTSO-E](https://www.entsoe.eu/) plays a crucial role in coordinating and promoting a reliable electricity market across Europe. It ensures that TSOs have the necessary frameworks and tools to maintain grid stability. By setting common standards and facilitating cooperation, ENTSO-E helps integrate diverse energy resources into a cohesive system that can handle the dynamic nature of electricity demand and supply.

### A comment on Great Britain

After Brexit, Great Britain left ENTSO-E. ESO is the TSO of England, Scotland and Wales. ESO is working on a [new framework for frequency response](https://www.nationalgrideso.com/industry-information/balancing-services/frequency-response-services/new-dynamic-services-dcdmdr) set to be implemented late 2024. Reference [ESOs Data Portal for Ancillary Services](https://www.nationalgrideso.com/data-portal/dynamic-containment-data) for  market prices. Pre

### Challenges and the Future of FCR

As Europe embraces more renewable energy, the role of DERs in FCR becomes increasingly important. However, this transition also brings challenges. Regulatory frameworks need to evolve to fully harness the potential of batteries and other new technologies. Market rules must ensure fair competition among different types of FCR providers.

### Further reading; European FCR

* [ENTSO-E: Frequency Containment Reserves (FCR)](https://www.entsoe.eu/network_codes/eb/fcr/)

