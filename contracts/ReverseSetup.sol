pragma solidity ^0.5.3;

import "@rsksmart/rns-registry/contracts/AbstractRNS.sol";

contract ReverseSetup {
    AbstractRNS rns;
    address nameResolver;
    address reverseRegistrar;
    address payable reverseOwner;

    bytes32 constant REVERSE = 0xa097f6721ce401e757d1223a763fef49b8b5f90bb18567ddb86fd205dff71d34;
    bytes32 constant ADDR_REVERSE = 0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2;

    constructor (
        AbstractRNS _rns,
        address _nameResolver,
        address _reverseRegistrar,
        address payable _reverseOwner
    ) public {
        rns = _rns;
        nameResolver = _nameResolver;
        reverseRegistrar = _reverseRegistrar;
        reverseOwner = _reverseOwner;
    }

   function run() external {
        require(rns.owner(REVERSE) == address(this), "Not reverse owner");

        // run
        rns.setResolver(REVERSE, nameResolver);
        rns.setSubnodeOwner(REVERSE, keccak256('addr'), reverseRegistrar);
        rns.setOwner(REVERSE, reverseOwner);

        // assert
        assert(rns.owner(REVERSE) == reverseOwner);
        assert(rns.owner(ADDR_REVERSE) == reverseRegistrar);
        assert(rns.resolver(REVERSE) == nameResolver);
        assert(rns.resolver(ADDR_REVERSE) == nameResolver);

        // self destruct
        selfdestruct(reverseOwner);
   }
}
