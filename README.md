This is a fork from https://github.com/johnoseni1/East-Marketplace-Full with changes made to work with Expanse network.

## Demo

Checkout the live demo: https://nft.room-house.com/

## Build

yarn add hardhat

Compile Solidity files:
npx hardhat compile

Deploy two contracts to Expanse:
npx hardhat run scripts/deploy.js --network expanse

Edit constants in .env file:
vi .env
...

Skip to "scripts" folder and run "replace_domain.sh" scripts with param "your_domain.name"
e.g. cd East_NFT/scripts && ./replace_domain.sh mydomain.com

yarn && yarn build

## Run

yarn run start
