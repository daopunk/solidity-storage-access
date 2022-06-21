require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.exports = {
  solidity: '0.8.4',
  networks: {
    rinkeby: {
      url: process.env.RINK_URL,
      accounts: [process.env.RINK_PRI],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
};