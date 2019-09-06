<img src="/logo.png" alt="logo" height="200" />

# RNS Reverse Resolution implementation

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
