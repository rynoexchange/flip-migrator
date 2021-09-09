require("ts-node").register({
  files: true
});

const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
  compilers: {
    solc: {
      version: '0.8.6',
      settings: {
        optimizer: {
          enabled: true,
          runs: 1500
        }
      }
    }
  },
  networks: {
    poa: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, 'https://core.poanetwork.dev/')
      },
      network_id: '99',
      gasPrice: 20000000000
    }
  }
}