pragma solidity >=0.4.22 <0.8.0;

import { ECRecover } from "../util/ECRecover.sol";

contract ECRecoverTest {
    function recover(
        bytes32 digest,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external pure returns (address) {
        return ECRecover.recover(digest, v, r, s);
    }
}
