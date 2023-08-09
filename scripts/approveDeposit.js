// Import necessary packages and contracts
const { ethers } = require("hardhat");
const { FXRootContractAbi } = require('../artifacts/FXRootContractAbi.js');
const ABI = require('../artifacts/contracts/Naruto.sol/Naruto.json');
require('dotenv').config();

//Transfer ERC721A tokens to the Ethereum FxChain network
async function main() {

  // Set up connections to network and wallet
  const networkAddress = 'https://ethereum-goerli.publicnode.com';
  const privateKey = process.env.PRIVATE_KEY;
  const provider = new ethers.providers.JsonRpcProvider(networkAddress);

  // Create a wallet instance
  const wallet = new ethers.Wallet(privateKey, provider);

  // Get the signer instance
  const [signer] = await ethers.getSigners();

  // Get ERC721A contract instance
  const NFT = await ethers.getContractFactory("Naruto");
  const nft = await NFT.attach('0xbF20D65246086EB580fE2d59Dca7814076DFE2cf'); //deployed address

  // Get FXRoot contract instance
  const fxRootAddress = '0xF9bc4a80464E48369303196645e876c8C7D972de';
  const fxRoot = await ethers.getContractAt(FXRootContractAbi, fxRootAddress);

  // TokenIds to transfer
  const tokenIds = [0, 1, 2, 3, 4]; 

  // Approve the nfts for transfer
  const approve = await nft.connect(signer).setApprovalForAll(fxRootAddress, true);
  await approve.wait();
  console.log('Approval confirmed');

  // Deposit the nfts to the FXRoot contracts
  for (let i = 0; i < tokenIds; i++) {
    const depositTx = await fxRoot.connect(signer).deposit(
      nft.address,
      wallet.address, 
      tokenIds[i],
      '0x6566'
    );

    // Wait for the deposit to be confirmed
    await depositTx.wait();
  }

  console.log("Approved and deposited");
  const balanceadd = await nft.balanceOf('0xf5816CE5804eB09F21c0093C90e5Da45452dD1F3');//metamask address

  // Print the balance of the wallet
  console.log(
    "wallet balance after minitng Naruto's NFT",
    '0xf5816CE5804eB09F21c0093C90e5Da45452dD1F3',   //metamask address
    "is: ",
    balanceadd.toString()
  );
}

// Call the main function and handle any errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
