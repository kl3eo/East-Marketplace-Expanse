const hre = require('hardhat')

async function main () {
  process.env.IS_RUNNING = true
  const Marketplace = await hre.ethers.getContractFactory('Marketplace')
  const marketplace = await Marketplace.deploy()
  await marketplace.deployed()
  console.log('Marketplace deployed to:', marketplace.address)

  const NFT = await hre.ethers.getContractFactory('NFT')
  const nft = await NFT.deploy(marketplace.address)
  await nft.deployed()
  console.log('Nft deployed to:', nft.address)
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
