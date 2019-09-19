var _contract = require('truffle-contract');
var rnsData = require('@rsksmart/rns-artifacts/build/contracts/RNS.json');
var RNS = _contract(rnsData);

const NameResolver = artifacts.require('NameResolver');
const ReverseRegistrar = artifacts.require('ReverseRegistrar');
const ReverseSetup = artifacts.require('ReverseSetup');

module.exports = (deployer, network, accounts) => {
  if (network === 'testnet') {
    const REVERSE_OWNER = accounts[0];

    RNS.setProvider(web3.currentProvider);

    let rns, resolver;

    return deployer.deploy(RNS, { from: accounts[0] }).then(_rns => {
      rns = _rns;
      return deployer.deploy(NameResolver, rns.address)
    }).then(_resolver => {
      resolver = _resolver;
      return deployer.deploy(ReverseRegistrar, rns.address)
    }).then(registrar => {
      return deployer.deploy(ReverseSetup, rns.address, resolver.address, registrar.address, REVERSE_OWNER);
    });
  }

  if (network === 'mainnet') {
    const RNS = '0xcb868aeabd31e2b66f74e9a55cf064abb31a4ad5'
    const REVERSE_OWNER = 'TODO' // COMPLETE WITH REVERSE OWNER AFTER DEPLOYMENT;

    let resolver;
    return deployer.deploy(NameResolver, RNS).then(_resolver => {
      resolver = _resolver;
      return deployer.deploy(ReverseRegistrar, RNS)
    }).then(registrar => {
      return deployer.deploy(ReverseSetup, RNS, resolver.address, registrar.address, REVERSE_OWNER);
    });
  }
}
