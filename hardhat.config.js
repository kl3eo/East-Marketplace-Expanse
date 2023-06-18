const path = require('path')
require('@nomiclabs/hardhat-waffle')
require("dotenv").config();
require('hardhat-gas-reporter')
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "expanse",
  networks: {
    hardhat: {},
    expanse: {
      url: process.env.DEV_API_URL,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      gas: 5500000,
      gasPrice: 7000000000
    },
  },
};

