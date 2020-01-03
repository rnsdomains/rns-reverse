const RNS = artifacts.require('RNS');
const NameResolver = artifacts.require('NameResolver');
const ReverseRegistrar = artifacts.require('ReverseRegistrar');
const ReverseSetup = artifacts.require('ReverseSetup');

const namehash = require('eth-ens-namehash').hash;

const { expect } = require('chai');
const { expectRevert } = require('@openzeppelin/test-helpers');

contract('ReverseRegistrar - RSK Claim', async accounts => {
  let rns, resolver, registrar;

  beforeEach(async () => {
    RNS.setProvider(web3.currentProvider);
    rns = await RNS.new({ from: accounts[0] });
    resolver = await NameResolver.new(rns.address);
    registrar = await ReverseRegistrar.new(rns.address);
    const reverseSetup = await ReverseSetup.new(rns.address, resolver.address, registrar.address, accounts[0]);
    await rns.setSubnodeOwner('0x00', web3.utils.sha3('reverse'), reverseSetup.address, { from: accounts[0] });
    await reverseSetup.run();
  });

  describe('registrar admin', async () => {
    it('should allow owner to add registrar', async () => {
      await registrar.addRskRegistrar(accounts[1]);

      expect(
        await registrar.isRskRegistrar(accounts[1])
      ).to.be.true;
    });

    it('should not allow not owner to set registrar', async () => {
      await expectRevert(
        registrar.addRskRegistrar(accounts[1], { from: accounts[1] }),
        'Ownable: caller is not the owner.',
      );
    });

    it('should allow owner to remove registrar', async () => {
      await registrar.addRskRegistrar(accounts[1]);

      await registrar.removeRskRegistrar(accounts[1]);

      expect(
        await registrar.isRskRegistrar(accounts[1])
      ).to.be.false;

    });

    it('should not allow not owner to set registrar', async () => {
      await registrar.addRskRegistrar(accounts[1]);

      await expectRevert(
        registrar.removeRskRegistrar(accounts[1], { from: accounts[2] }),
        'Ownable: caller is not the owner.',
      );
    });
  });

  describe('.rsk claim',  async() => {
    it('should allow rsk registrar to register new records', async () => {
      await registrar.addRskRegistrar(accounts[0]);

      await registrar.rskClaim(accounts[1], 'ilan');

      const node = namehash(`${accounts[1].slice(2).toLowerCase()}.addr.reverse`);

      expect(
        await resolver.name(node)
      ).to.eq('ilan.rsk');
    });

    it('should not allow not rsk registrar to register new records', async () => {
      await expectRevert(
        registrar.rskClaim(accounts[0], 'attack'),
        'Not rsk registrar.',
      );
    });
  });
});