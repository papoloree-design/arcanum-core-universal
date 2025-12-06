require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require('dotenv').config({ path: '../../.env' });

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000';
const POLYGON_RPC = process.env.POLYGON_RPC || 'https://polygon-rpc.com';
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || '';

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    },
    polygon: {
      url: POLYGON_RPC,
      chainId: 137,
      accounts: [DEPLOYER_PRIVATE_KEY],
      gasPrice: 'auto',
      gas: 'auto'
    }
  },
  etherscan: {
    apiKey: {
      polygon: POLYGONSCAN_API_KEY
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === 'true',
    currency: 'USD',
    coinmarketcap: process.env.COINMARKETCAP_API_KEY
  }
};
