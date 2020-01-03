pragma solidity ^0.5.3;

import "@rsksmart/rns-registry/contracts/AbstractRNS.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/access/Roles.sol";
import "./NameResolver.sol";

contract ReverseRegistrar is Ownable {
    using Roles for Roles.Role;

    // namehash('addr.reverse')
    bytes32 public constant ADDR_REVERSE_NODE = 0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2;

    AbstractRNS public rns;

    modifier onlyRskRegistrar {
        require(isRskRegistrar(msg.sender), "Not rsk registrar.");
        _;
    }

    /// @dev Constructor
    /// @param rnsAddr The address of the RNS registry.
    constructor(AbstractRNS rnsAddr) public {
        rns = rnsAddr;
    }

    /// @notice Sets the name record on that name to the specified name
    /// @dev Sets the resolver for the name hex(msg.sender).addr.reverse to a default resolver
    /// @param name The name to set for this address.
    /// @return The RNS node hash of the reverse record.
    function setName(string calldata name) external returns (bytes32 _node) {
        _node = claim(address(this));
        NameResolver(rns.resolver(_node)).setName(_node, name);
    }

    /// @notice Transfer ownership of the name hex(msg.sender).addr.reverse
    /// @dev Allows the caller to specify an owner other than themselves.
    /// The resulting account has `name()` resolver.
    /// @param recordOwner The address to set as the owner of the reverse record in RNS.
    /// @return The RNS node hash of the reverse record.
    function claim(address recordOwner) public returns (bytes32) {
        bytes32 label = sha3HexAddress(msg.sender);
        rns.setSubnodeOwner(ADDR_REVERSE_NODE, label, recordOwner);
        return keccak256(abi.encodePacked(ADDR_REVERSE_NODE, label));
    }

    /// @notice Sets the resolver of the name hex(msg.sender).addr.reverse to the specified resolver
    /// @dev Transfer ownership of the name to the provided address.
    /// @param recordOwner The address to set as the owner of the reverse record in RNS.
    /// @param resolver The address of the resolver to set; 0 to leave default.
    /// @return The RNS node hash of the reverse record.
    function claimWithResolver(address recordOwner, address resolver) external returns (bytes32 _node) {
        bytes32 label = sha3HexAddress(msg.sender);
        _node = keccak256(abi.encodePacked(ADDR_REVERSE_NODE, label));

        if (rns.owner(_node) != address(this))
            rns.setSubnodeOwner(ADDR_REVERSE_NODE, label, address(this));
        // registrar owns the node, with default resolver

        if (resolver != address(0x0) && resolver != rns.resolver(ADDR_REVERSE_NODE))
            rns.setResolver(_node, resolver);
        // node has default resolver for 0x00 or resolver value

        if (recordOwner != address(this))
            rns.setOwner(_node, recordOwner);
        // owner owns node
    }

    /// @dev Returns the node hash for a given account's reverse records.
    /// @param addr The address to hash
    /// @return The RNS node hash.
    function node(address addr) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(ADDR_REVERSE_NODE, sha3HexAddress(addr)));
    }

    /// @dev An optimised function to compute the sha3 of the lower-case
    /// hexadecimal representation of an Ethereum address.
    /// @param addr The address to hash
    /// @return The SHA3 hash of the lower-case hexadecimal encoding of the
    /// input address.
    function sha3HexAddress(address addr) private pure returns (bytes32 ret) {
        assembly {
            let lookup := 0x3031323334353637383961626364656600000000000000000000000000000000

            for { let i := 40 } gt(i, 0) { } {
                i := sub(i, 1)
                mstore8(i, byte(and(addr, 0xf), lookup))
                addr := div(addr, 0x10)
                i := sub(i, 1)
                mstore8(i, byte(and(addr, 0xf), lookup))
                addr := div(addr, 0x10)
            }

            ret := keccak256(0, 40)
        }
    }

    /**********************/
    /* .rsk registrations */
    /**********************/

    // Allow different contracts to register reverse records for .rsk domains.
    // It is assumed that these contracts register rsk names and send to this contract
    // an address that is appropriate by the registrant

    /// @notice Allows .rsk registrars to create reverse records.
    /// @param addr The addr to register
    /// @param label The label to prepend to .rsk and set as name.
    function rskClaim(address addr, string calldata label) external onlyRskRegistrar {
        bytes32 _label = sha3HexAddress(addr);
        rns.setSubnodeOwner(ADDR_REVERSE_NODE, _label, address(this));
        bytes32 _node = keccak256(abi.encodePacked(ADDR_REVERSE_NODE, _label));
        NameResolver(
            rns.resolver(_node)
        ).setName(
            _node,
            string(
                abi.encodePacked(
                    bytes(label),
                    bytes(".rsk")
                )
            )
        );
    }

    Roles.Role rskRegistrars;

    /// @notice Give an account access to registrar role.
    /// @dev Only owner.
    /// @param registrar new registrar.
    function addRskRegistrar(address registrar) external onlyOwner {
        rskRegistrars.add(registrar);
    }

    /// @notice Check if an account has registrar role.
    /// @param registrar to query if has registrar role.
    /// @return true if it has registrar role.
    function isRskRegistrar(address registrar) public view returns (bool) {
        return rskRegistrars.has(registrar);
    }

    /// @notice Remove an account's access to registrar role.
    /// @dev Only owner
    /// @param registrar registrar to remove from registrar role.
    function removeRskRegistrar(address registrar) external onlyOwner {
        rskRegistrars.remove(registrar);
    }
}
