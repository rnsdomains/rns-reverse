const RNS = artifacts.require('RNS');
const NameResolver = artifacts.require('NameResolver');
const ReverseRegistrar = artifacts.require('ReverseRegistrar');
const ReverseSetup = artifacts.require('ReverseSetup');

const namehash = require('eth-ens-namehash').hash;

const expectRevert = require('openzeppelin-test-helpers').expectRevert;
const expect = require('chai').expect;

contract('ReverseSetup', async accounts => {
  let rns, resolver, registrar, reverseSetup;

  const reverse = namehash('reverse');
  const addrreverse = namehash('addr.reverse');

  beforeEach(async () => {
    RNS.setProvider(web3.currentProvider);
    rns = await RNS.new({ from: accounts[0] });
    resolver = await NameResolver.new(rns.address);
    registrar = await ReverseRegistrar.new(rns.address);
    reverseSetup = await ReverseSetup.new(rns.address, resolver.address, registrar.address, accounts[0]);
  });

  it('should throw if reverse is not owned', async () => {
    await expectRevert(
      reverseSetup.run(),
      'Not reverse owner',
    );
  });

  it('should setup reverse solution', async () => {
    await rns.setSubnodeOwner('0x00', web3.utils.sha3('reverse'), reverseSetup.address, { from: accounts[0] });
    await reverseSetup.run();

    const reverseOwner = await rns.owner(reverse);
    const reverseResolver = await rns.resolver(reverse);
    const addrReverseOwner = await rns.owner(addrreverse);
    const addrReverseResolver = await rns.resolver(addrreverse);

    expect(reverseOwner).to.eq(accounts[0], 'reverse owner');
    expect(reverseResolver).to.eq(resolver.address, 'reverse resolver');
    expect(addrReverseOwner).to.eq(registrar.address, 'addr.reverse owner');
    expect(addrReverseResolver).to.eq(resolver.address,' addr.reverse resolver');
  });

  it('should selfdestruct', async () => {
    await rns.setSubnodeOwner('0x00', web3.utils.sha3('reverse'), reverseSetup.address, { from: accounts[0] });
    await reverseSetup.run();

    const code = await web3.eth.getCode(reverseSetup.address);
    expect(code).to.eq('0x');
  });
});
