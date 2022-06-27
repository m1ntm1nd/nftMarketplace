/**
 * @type import('hardhat/config').HardhatUserConfig
 */

 require('@nomiclabs/hardhat-ethers');
 require("@nomiclabs/hardhat-waffle");
 require("@nomiclabs/hardhat-etherscan");
 require('hardhat-contract-sizer');
 require("dotenv").config();
 require("hardhat-deploy");
 require('solidity-coverage');

module.exports = {
  solidity: {
    compilers: [
    {
      version: "0.8.15",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  ]
  },
  networks: {
    rinkeby: {
      url: process.env.RPC_NODE_URL_RINKEBY,
      gasPrice: 5000000000, //5 gwei
      timeout: 3600000,
      accounts: [process.env.PRIVATE_KEY]
    },
    matic: {
      url: process.env.RPC_NODE_URL_MUMBAI,
      gas: 2100000, 
      gasPrice: 8000000000,
      accounts: [process.env.PRIVATE_KEY]
    },
    mainnet: {
      url: process.env.RPC_NODE_URL_MAINNET,
      accounts: [process.env.PRIVATE_KEY]
    },
    goerli: {
      url: process.env.RPC_NODE_URL_GOERLI,
      gasPrice: 5000000000, //5 gwei
      timeout: 3600000,
      accounts: [process.env.PRIVATE_KEY]
    },
    bsc: {
      url: process.env.RPC_NODE_URL_BSCTESTNET,
      accounts: [process.env.PRIVATE_KEY]
    },
    localhost: {
      gasPrice: 200000000000, //200 gwei
    },
  },
  etherscan: {
    apiKey: {
      mainnet:
        process.env.SCAN_API_KEY_ETH,
      polygon:
        process.env.SCAN_API_KEY_MATIC,
      bsc:
        process.env.SCAN_API_KEY_BSC
    }
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  plugins: ["solidity-coverage"]
};