This is a fork from https://github.com/johnoseni1/East-Marketplace-Full with changes made to work with Expanse network.

## Demo

Checkout the live demo: https://nft.room-house.com/

## Build

Compile Solidity files:
npx hardhat compile

Deploy two contracts to Expanse:
npx hardhat run scripts/deploy.js --network expanse

Edit constants in .env file:
vi .env
...

yarn && yarn build

## Run

yarn run start


## TODO

replace Pinata IPFS with some free unlimited space uploader
