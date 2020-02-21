<img src="/logo.png" alt="logo" height="200" />

# RNS Reverse Resolution implementation

[![npm version](https://badge.fury.io/js/%40rsksmart%2Frns-reverse.svg)](https://badge.fury.io/js/%40rsksmart%2Frns-reverse)
[![Crytic Status](https://crytic.io/api/repositories/voO36L6vQGafg0e3kI0Fxw/badge.svg?token=f8a2448e-5aa2-4398-83e4-254789b2f3e6)](https://crytic.io/rnsdomains/rns-reverse)

- Name resolver: [0x4b1a11bf6723e60b9d2e02aa3ece34e24bde77d9](https://explorer.rsk.co/address/0x4b1a11bf6723e60b9d2e02aa3ece34e24bde77d9)
- Reverse registrar: [0xd25c3f94a743b93ecffecbe691beea51c3c2d9d1](https://explorer.rsk.co/address/0xd25c3f94a743b93ecffecbe691beea51c3c2d9d1)

> Read the docs [here](https://docs.rns.rifos.org/Architecture/ReverseSuite/)

## Summary

RIF implementation of [EIP-181](https://eips.ethereum.org/EIPS/eip-181) in RSK network. 

## Abstract

EIP-181 specifies a TLD, registrar, and resolver interface for reverse resolution of Ethereum addresses using ENS. RIF applies to this specification and proposes a different implementation, based on the technical differences on the protocol.

### EIP181 compatibillity

RNS Reverse registrar and resolver are fully compatible with the EIP-181 specification.

### Default resolver

In RNS, default resolver is the node's resolver. When `setSubnodeOwner` is triggered the subnode created inherits the node's resolver.

### `claimWithResolver` result

If the resolver address specified is `0x00`, leaves default resolver.
