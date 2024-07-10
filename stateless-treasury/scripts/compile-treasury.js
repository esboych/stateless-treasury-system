const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');

async function compileContract() {
  // Define the contract paths
  const contractPath = path.resolve(__dirname, 'contracts', 'Treasury.sol');
  const openZeppelinBasePath = path.resolve(__dirname, 'node_modules', '@openzeppelin', 'contracts');

  // Read the main contract and the OpenZeppelin dependencies
  const sources = {
    'Treasury.sol': {
      content: fs.readFileSync(contractPath, 'utf8')
    },
    '@openzeppelin/contracts/token/ERC20/ERC20.sol': {
      content: fs.readFileSync(path.resolve(openZeppelinBasePath, 'token', 'ERC20', 'ERC20.sol'), 'utf8')
    },
    '@openzeppelin/contracts/token/ERC20/IERC20.sol': {
      content: fs.readFileSync(path.resolve(openZeppelinBasePath, 'token', 'ERC20', 'IERC20.sol'), 'utf8')
    },
    '@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol': {
      content: fs.readFileSync(path.resolve(openZeppelinBasePath, 'token', 'ERC20', 'extensions', 'IERC20Metadata.sol'), 'utf8')
    },
    '@openzeppelin/contracts/utils/Context.sol': {
      content: fs.readFileSync(path.resolve(openZeppelinBasePath, 'utils', 'Context.sol'), 'utf8')
    },
    '@openzeppelin/contracts/interfaces/draft-IERC6093.sol': {
      content: fs.readFileSync(path.resolve(openZeppelinBasePath, 'interfaces', 'draft-IERC6093.sol'), 'utf8')
    }
  };

  const input = {
    language: 'Solidity',
    sources,
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
    },
  };

  // Select the correct solc version
  const solcVersion = 'v0.8.20+commit.a1b79de6';
  const compiler = await new Promise((resolve, reject) => {
    solc.loadRemoteVersion(solcVersion, (err, solcSpecific) => {
      if (err) {
        reject(err);
      } else {
        resolve(solcSpecific);
      }
    });
  });

  const output = JSON.parse(compiler.compile(JSON.stringify(input)));

  // Debug: Log the output from the compiler
  console.log('Compiler Output:', JSON.stringify(output, null, 2));

  if (!output.contracts || !output.contracts['Treasury.sol'] || !output.contracts['Treasury.sol'].Treasury) {
    throw new Error('Compilation error: Invalid contract structure');
  }

  const abi = output.contracts['Treasury.sol'].Treasury.abi;
  const bytecode = output.contracts['Treasury.sol'].Treasury.evm.bytecode.object;

  // Ensure the build directory exists
  const buildDir = path.resolve(__dirname, 'build');
  fs.ensureDirSync(buildDir);

  // Write the ABI and bytecode to JSON files
  const abiPath = path.resolve(buildDir, 'TreasuryABI.json');
  const bytecodePath = path.resolve(buildDir, 'TreasuryBytecode.json');
  fs.writeFileSync(abiPath, JSON.stringify(abi, null, 2));
  fs.writeFileSync(bytecodePath, JSON.stringify(bytecode, null, 2));

  console.log('ABI saved to:', abiPath);
  console.log('Bytecode saved to:', bytecodePath);
}

compileContract().catch((error) => {
  console.error(error);
});
