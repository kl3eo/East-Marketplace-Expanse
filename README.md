This is a fork from https://github.com/johnoseni1/East-Marketplace-Full with changes made to work with Expanse network.

## Demo

Checkout the live demo: https://nft.room-house.com/

DEPLOY CONTRACTS 
################
(if using pre-compiled binaries from artifacts/contracts/, - skip to BUILD)

Edit source Marketplace.sol and NFT.sol from contracts/ and trim your contracts as you wish.

Compile Solidity files:
npx hardhat compile

Deploy two contracts with command:
npx hardhat run scripts/deploy.js --network expanse

Edit address constants in .env file:
vi .env
...

BUILD
#####

## Build with yarn v1.22

with node 22.2.0 tested on Ubuntu 24.04

Install required packages:
yarn 

Build:
yarn build

Run app on 127.0.0.1 default port 3000 (or set another port in package.json and re-build):
yarn run start

Use Apache as proxy to link the running app to external IP, host name and port.


