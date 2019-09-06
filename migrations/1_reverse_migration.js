const _contract = require('truffle-contract');
const rnsData = require('@rsksmart/rns-artifacts/build/contracts/RNS.json');
const RNS = _contract(rnsData);
const ReverseRegistrar = artifacts.require('ReverseRegistrar');
const NameResolver = artifacts.require('NameResolver');

const namehash = require('eth-ens-namehash').hash;

module.exports = (deployer, network, accounts) => {
  if (network === 'development') {
    return devMigration(deployer, accounts[0]);
  }

  if (network === 'testnet') {
    return prodMigration(deployer, '0xe0ba8a9ff14a7dfeab227a4f685b08a1084f4ad1');
  }

  if (network === 'mainnet') {
    return prodMigration(deployer, '0xcb868aeabd31e2b66f74e9a55cf064abb31a4ad5');
  }

  console.log('invalid network');
};

function devMigration (deployer, from) {
  let rns, resolver, registrar;

  RNS.setProvider(web3.currentProvider);
  return deployer
  .deploy(RNS, { from })
  .then(_rns => {
    rns = _rns;
    return deployer.deploy(NameResolver, rns.address);
  })
  .then(_resolver => {
    resolver = _resolver;
    return deployer.deploy(ReverseRegistrar, rns.address);
  })
  .then(_registrar => {
    registrar = _registrar;
  })
  .then(() => {
    return rns.setSubnodeOwner('0x00', web3.utils.sha3('reverse'), from, { from })
  })
  .then(() => {
    return rns.setSubnodeOwner(namehash('reverse'), web3.utils.sha3('addr'), from, { from });
  })
  .then(() => {
    return rns.setResolver(namehash('addr.reverse'), resolver.address, { from });
  })
  .then(() => {
    return rns.setOwner(namehash('addr.reverse'), registrar.address, { from });
  });
}

function prodMigration (deployer, rnsAddress) {
  return deployer
  .deploy(ReverseRegistrar, rnsAddress)
  .then(_ => {
    return deployer.deploy(NameResolver, rnsAddress);
  });
}