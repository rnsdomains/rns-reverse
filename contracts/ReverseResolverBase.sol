pragma solidity ^0.8.4;

/// source: https://github.com/ensdomains/resolvers/blob/master/contracts/ResolverBase.sol
contract ReverseResolverBase {
    bytes4 private constant INTERFACE_META_ID = 0x01ffc9a7;

    function supportsInterface(bytes4 interfaceID)
        public
        pure
        virtual
        returns (bool)
    {
        return interfaceID == INTERFACE_META_ID;
    }
}
