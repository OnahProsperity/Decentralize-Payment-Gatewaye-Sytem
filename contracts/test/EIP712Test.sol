pragma solidity >=0.4.22 <0.8.0;

import { EIP712 } from "../util/EIP712.sol";

contract EIP712Test {
    function makeDomainSeparator(string calldata name, string calldata version)
        external
        view
        returns (bytes32)
    {
        return EIP712.makeDomainSeparator(name, version);
    }

    function recover(
        bytes32 domainSeparator,
        uint8 v,
        bytes32 r,
        bytes32 s,
        bytes calldata typeHashAndData
    ) external pure returns (address) {
        return EIP712.recover(domainSeparator, v, r, s, typeHashAndData);
    }
}
