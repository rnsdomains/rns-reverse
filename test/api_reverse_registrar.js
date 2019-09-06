var _contract = require('truffle-contract');
var rnsData = require('@rsksmart/rns-artifacts/build/contracts/RNS.json');
var RNS = _contract(rnsData);
const NameResolver = artifacts.require('NameResolver');
const ReverseRegistrar = artifacts.require('ReverseRegistrar');
const ReverseAPI = require('../api/src');

const assert = require('assert');
const namehash = require('eth-ens-namehash').hash;

contract('NameResolver API', async accounts => {
  let rns, resolver, registrar, reverseApi;
  const root = namehash('addr.reverse');

  beforeEach(async () => {
    RNS.setProvider(web3.currentProvider);
    rns = await RNS.new({ from: accounts[0] });
    resolver = await NameResolver.new(rns.address);
    registrar = await ReverseRegistrar.new(rns.address);

    await rns.setSubnodeOwner('0x00', web3.utils.sha3('reverse'), accounts[0], { from: accounts[0] });
    await rns.setSubnodeOwner(namehash('reverse'), web3.utils.sha3('addr'), accounts[0], { from: accounts[0] });
    await rns.setResolver(root, resolver.address, { from: accounts[0] });
    await rns.setOwner(root, registrar.address, { from: accounts[0] });

    //api
    let contracts = {
      reverseRegistrar: registrar.address,
      nameResolver: resolver.address
    };
    reverseApi = new ReverseAPI(web3, contracts);
  });

  // it('sets a name for the sender address', async () => {
  //   const expectedName = "javi.rsk";
    
  //   await reverseApi.registrar.setName(expectedName, {from: accounts[0]});

  //   const actualName = await resolver.name(accounts[0]);

  //   assert.equal(actualName, expectedName);
  // });

  it('resolves an address name', async () => {
    const expectedName = 'javi.rsk';
    await registrar.setName(expectedName);

    const actualName = await reverseApi.resolver.name(accounts[0]);

    assert.equal(actualName, expectedName);
  });
});
