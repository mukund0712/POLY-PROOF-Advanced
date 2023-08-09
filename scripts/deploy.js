const hre = require("hardhat");
const fs = require('fs');
async function main() {
  // Get the contract factory
  const NFT = await hre.ethers.getContractFactory("Naruto");

  // Deploy the contract
  const nft = await NFT.deploy();

  // Wait for the contract to be deployed
  await nft.deployed();

  // Log the contract address
  console.log("Naruto NFT contract deployed to the address:", nft.address);

  // export the addresses
  fs.writeFileSync('metadata/contractAddress.js', `
    export const nftAddress = "${nft.address}"
  `)
}

// Execute the deployment function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
