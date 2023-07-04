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


## DONE

..replace Pinata IPFS with a free unlimited space uploader
..show lots first without connect, then connect
..filter lots on metadata
..search 'tags' of metadata
..replace 'approval' with new sell
..auto click 'Connect' button in 3 sec
..added Redux to share all stuff
..async loading all while display first 60
