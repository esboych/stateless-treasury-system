const Web3 = require('web3');
const fs = require('fs');
const path = require('path');

async function deployContract() {
  const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

  // Adjust paths to the correct location
  const treasuryAbiPath = path.resolve(__dirname, '..', 'build', 'TreasuryABI.json');
  const treasuryBytecodePath = path.resolve(__dirname, '..', 'build', 'TreasuryBytecode.json');

  const treasuryAbi = JSON.parse(fs.readFileSync(treasuryAbiPath));
  const treasuryBytecode = JSON.parse(fs.readFileSync(treasuryBytecodePath));

  const accounts = await web3.eth.getAccounts();
  const deployerAddress = accounts[0];

  const tokenAddress = '0xc1224ecd86e87679fa5dc157b23451c0441c5b38'; // Replace with the actual token contract address

  const TreasuryContract = new web3.eth.Contract(treasuryAbi);

  const gasEstimate = await TreasuryContract.deploy({
    data: treasuryBytecode,
    arguments: [tokenAddress] // Pass the token contract address as a constructor argument
  }).estimateGas({ from: deployerAddress });

  const treasuryInstance = await TreasuryContract.deploy({
    data: treasuryBytecode,
    arguments: [tokenAddress] // Pass the token contract address as a constructor argument
  }).send({
    from: deployerAddress,
    gas: gasEstimate
  });

  console.log('Treasury Contract deployed at:', treasuryInstance.options.address);
}

deployContract().catch((error) => {
  console.error(error);
});
