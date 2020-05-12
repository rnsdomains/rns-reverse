<p align="middle">
    <img src="https://www.rifos.org/assets/img/logo.svg" alt="logo" height="100" >
</p>
<h3 align="middle"><code>rns-reverse</code></h3>
<p align="middle">
    RNS reverse records registrar and resolver
</p>
<p align="middle">
    <a href="https://circleci.com/gh/rnsdomains/rns-reverse">
        <img src="https://circleci.com/gh/rnsdomains/rns-reverse.svg?style=svg" alt="CircleCI" />
    </a>
    <a href="https://badge.fury.io/js/%40rsksmart%2Frns-reverse">
        <img src="https://badge.fury.io/js/%40rsksmart%2Frns-reverse.svg" alt="npm" />
    </a>
    <a href="https://crytic.io/rnsdomains/rns-reverse">
      <img src="https://crytic.io/api/repositories/voO36L6vQGafg0e3kI0Fxw/badge.svg?token=f8a2448e-5aa2-4398-83e4-254789b2f3e6" />
    </a>
    <a href="https://developers.rsk.co/rif/rns/architecture/ReverseSuite/">
      <img src="https://img.shields.io/badge/-docs-brightgreen" alt="docs" />
    </a>
    <a href="https://eips.ethereum.org/EIPS/eip-181">
      <img src="https://img.shields.io/badge/-specs-lightgrey" alt="specs" />
    </a>
</p>

RIF implementation of [EIP-181](https://eips.ethereum.org/EIPS/eip-181) in RSK network.

```
npm i @rsksmart/rns-reverse
```

Deployments:
- RSK Mainnet:
  - ReverseRegistrar: [0xd25c3f94a743b93ecffecbe691beea51c3c2d9d1](https://explorer.testnet.rsk.co/address/0xd25c3f94a743b93ecffecbe691beea51c3c2d9d1)
  - NameResolver: [0x4b1a11bf6723e60b9d2e02aa3ece34e24bde77d9](https://explorer.testnet.rsk.co/address/0x4b1a11bf6723e60b9d2e02aa3ece34e24bde77d9)
- RSK Testnet:
  - ReverseRegistrar: [0xc1cb803d5169e0a9894bf0f8dcdf83090999842a](https://explorer.testnet.rsk.co/address/0xc1cb803d5169e0a9894bf0f8dcdf83090999842a)
  - NameResolver: [0x8587385ad60038bB181aFfDF687c4D1B80C4787e](https://explorer.testnet.rsk.co/address/0x8587385ad60038bB181aFfDF687c4D1B80C4787e)

## Abstract

EIP-181 specifies a TLD, registrar, and resolver interface for reverse resolution of Ethereum addresses using ENS. RIF applies to this specification and proposes a different implementation, based on the technical differences on the protocol.

Regard:

- **EIP181 compatibillity**: RNS Reverse registrar and resolver are fully compatible with the EIP-181 specification.
- **Default resolver**: In RNS, default resolver is the node's resolver. When `setSubnodeOwner` is triggered the subnode created inherits the node's resolver.
- **`claimWithResolver` result**: If the resolver address specified is `0x00`, leaves default resolver.

## Usage

```solidity
pragma solidity ^0.5.0;

import "@rsksmart/rns-registry/contracts/ReverseRegistrar.sol";

contract MyContract {
  constructor(ReverseRegistrar _reverse) public {
    _reverse.setName("mycontract.rsk");
  }
}
```

```js
const Web3 = require('web3');
const ReverseRegistrarData = require('@rsksmart/rns-registry/ReverseRegistrarData.json');

const web3 = new Web3('https://public-node.rsk.co')
const ReverseRegistrar = new web3.eth.Contract(ReverseRegistrarData.abi, ReverseRegistrarData.address.rskMainnet);
```
