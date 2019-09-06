var _contract = require('truffle-contract');
var rnsData = require('@rsksmart/rns-artifacts/build/contracts/RNS.json');
var RNS = _contract(rnsData);
const NameResolver = artifacts.require('NameResolver');
const ReverseRegistrar = artifacts.require('ReverseRegistrar');

const assert = require('assert');
const namehash = require('eth-ens-namehash').hash;

contract('ReverseRegistrar - EIP-181 compatibillity', async accounts => {
  let rns, resolver, registrar;
  const root = namehash('addr.reverse');
  const node = namehash(`${accounts[0].slice(2).toLowerCase()}.addr.reverse`);

  beforeEach(async () => {
    RNS.setProvider(web3.currentProvider);
    rns = await RNS.new({ from: accounts[0] });
    resolver = await NameResolver.new(rns.address);
    registrar = await ReverseRegistrar.new(rns.address);

    await rns.setSubnodeOwner('0x00', web3.utils.sha3('reverse'), accounts[0], { from: accounts[0] });
    await rns.setSubnodeOwner(namehash('reverse'), web3.utils.sha3('addr'), accounts[0], { from: accounts[0] });
    await rns.setResolver(root, resolver.address, { from: accounts[0] });
    await rns.setOwner(root, registrar.address, { from: accounts[0] });
  });

  it('must own addr.reverse', async () => {
    const actualOwner = await rns.owner(root);

    assert.equal(actualOwner, registrar.address);
  });

  it('must use name resolver', async () => {
    const actualResolver = await rns.resolver(root);

    assert.equal(actualResolver, resolver.address);
  });

  describe('setName - When called by account x', async () => {
    it('sets the resolver for the name hex(x).addr.reverse to a default resolver', async () => {
      await registrar.setName('ilan.rsk');

      const actualResolver = await rns.resolver(node);

      assert.equal(actualResolver, resolver.address);
    });

    it('sets the name record on that name to the specified name', async () => {
      const name = 'ilan.rsk';
      await registrar.setName(name);

      const actualName = await resolver.name(node);

      assert.equal(actualName, name);
    });
  });

  describe('claim - When called by account x', async () => {
    it('transfer ownership of the name hex(x).addr.reverse', async () => {
      await registrar.claim(accounts[0]);

      const owner = await rns.owner(node);

      assert.equal(owner, accounts[0]);
    });

    it('Allowing the caller to specify an owner other than themselves', async () => {
      await registrar.claim(accounts[1]);

      const owner = await rns.owner(node);

      assert.equal(owner, accounts[1]);
    });
  });

  describe('claimWithResolver - When called by account x', async () => {
    const customResolver = '0x0000000000111111111122222222223333333333';

    it('sets the resolver of the name hex(x).addr.reverse to the specified resolver', async () => {
      await registrar.claimWithResolver(accounts[0], customResolver);

      const actualResolver = await rns.resolver(node);

      assert.equal(actualResolver, customResolver);
    });

    it('transfer ownership of the name to the provided address', async () => {
      await registrar.claimWithResolver(accounts[1], '0x0000000000000000000000000000000000000000');

      const owner = await rns.owner(node);

      assert.equal(owner, accounts[1]);
    });
  });
});
