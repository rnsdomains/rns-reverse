const NameResolver = artifacts.require('NameResolver');
const ReverseRegistrar = artifacts.require('ReverseRegistrar');
const ReverseSetup = artifacts.require('ReverseSetup');

module.exports = (deployer, network, accounts) => {
  if (network === 'mainnet') {
    const RNS = '0xcb868aeabd31e2b66f74e9a55cf064abb31a4ad5'
    const REVERSE_OWNER = '0X0000000000000000000000000000000000000000' // COMPLETE WITH REVERSE OWNER AFTER DEPLOYMENT;

    let resolver;
    return deployer.deploy(NameResolver, RNS).then(_resolver => {
      resolver = _resolver;
      return deployer.deploy(ReverseRegistrar, RNS)
    }).then(registrar => {
      return deployer.deploy(ReverseSetup, RNS, resolver.address, registrar.registrar, REVERSE_OWNER);
    });
  }
}
