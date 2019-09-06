pragma solidity ^0.5.0;

import "./ResolverBase.sol";
import "@rsksmart/rns-artifacts/contracts/registry/AbstractRNS.sol";

/// source: https://github.com/ensdomains/resolvers/blob/master/contracts/profiles/NameResolver.sol
contract NameResolver is ResolverBase {
    bytes4 constant private NAME_INTERFACE_ID = 0x691f3431;
    AbstractRNS rns;

    event NameChanged(bytes32 indexed node, string name);

    mapping(bytes32=>string) names;

    modifier onlyOwner (bytes32 node) {
        require(msg.sender == rns.owner(node), "Only owner");
        _;
    }

    constructor (AbstractRNS _rns) public {
        rns = _rns;
    }

    /**
     * Sets the name associated with an ENS node, for reverse records.
     * May only be called by the owner of that node in the ENS registry.
     * @param node The node to update.
     * @param name The name to set.
     */
    function setName(bytes32 node, string calldata name) external onlyOwner(node) {
        names[node] = name;
        emit NameChanged(node, name);
    }

    /**
     * Returns the name associated with an ENS node, for reverse records.
     * Defined in EIP181.
     * @param node The ENS node to query.
     * @return The associated name.
     */
    function name(bytes32 node) external view returns (string memory) {
        return names[node];
    }

    function supportsInterface(bytes4 interfaceID) public pure returns(bool) {
        return interfaceID == NAME_INTERFACE_ID || super.supportsInterface(interfaceID);
    }
}
