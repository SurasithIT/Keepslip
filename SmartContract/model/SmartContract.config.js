const ethers = require("ethers");
const contractJSON = require("./truffle/build/contracts/KeepSlip.json");

// const provider = new ethers.providers.JsonRpcProvider("http://35.247.154.183:8545");
let provider = ethers.getDefaultProvider(
  "kovan",
  "26c25ad8a6574ff784188acd2fb8727f"
);

let privateKey =
  "b3caecd0278206321e03889f0c97db39b0806ff1425a0b0567c58cce5c0f3167";
let wallet = new ethers.Wallet(privateKey, provider);
let address = wallet.address;

// init contract
const contractAddress = "0x0C5Da0a58A4a82d4810E6Abd15Fec98Ac52a51F0";
const contractABI = contractJSON.abi;
let contract = new ethers.Contract(contractAddress, contractABI, provider);
// console.log(contract);

// init contract with sign wallet
let contractWithSigner = contract.connect(wallet);

module.exports = {
  wallet,
  address,
  contract,
  contractWithSigner,
};
