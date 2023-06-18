require("dotenv").config();
const { ethers } = require("ethers");

const contract = require("../artifacts/contracts/NFT.sol/NFT.json");
const contractInterface = contract.abi;

const providerURL = 'https://node.expanse.tech';

const provider = ethers.getDefaultProvider(providerURL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const myTokens = new ethers.Contract(
  process.env.NFT_CONTRACT_ADDRESS_EXPANSE,
  contractInterface,
  wallet
);

const burnToken = 1;
const main = () => {
  myTokens
    .burn(burnToken)
    .then((transaction) => console.log(transaction))
    .catch((e) => console.log("something went wrong", e));
};

main();

