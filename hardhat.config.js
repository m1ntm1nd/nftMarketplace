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
  solidity: "0.8.11",
  networks: {
    rinkeby: {
      url: process.env.RPC_NODE_URL_RINKEBY,
      gasPrice: 5000000000, //5 gwei
      timeout: 3600000,
      accounts: [process.env.PRIVATE_KEY]
    },
    goerli: {
      url: process.env.RPC_NODE_URL_GOERLI,
      gasPrice: 5000000000, //5 gwei
      timeout: 3600000,
      accounts: [process.env.PRIVATE_KEY]
    },
    localhost: {
      gasPrice: 200000000000, //200 gwei
      mining: {
        auto: false,
        interval: [13000, 16000]
      },
    },
    bsc: {
      url: process.env.RPC_NODE_URL_BSCTESTNET,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.SCAN_API_KEY_BSC
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  plugins: ["solidity-coverage"]
};