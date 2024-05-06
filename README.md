# Polkadot Blockchain Academy: On-Chain Identity Retrieve Tool

This repository contains code for a tool designed to retrieve on-chain identities from the Polkadot blockchain. The tool utilizes React for the frontend and interacts with the Polkadot API to fetch identity information associated with provided addresses.

User is meant to provide a `comma separated` address list, that will then 

### Installation

This repository is using `pnpm`. In order to install all dependencies just run:
```
pnpm install
```

### Run initial setup

With polkadot-api the following commands will setup the dot chain for the repo:

```
npx papi add dot -n polkadot
npx papi
```

once that is done one can run the code by executing:

```
pnpm run dev
```