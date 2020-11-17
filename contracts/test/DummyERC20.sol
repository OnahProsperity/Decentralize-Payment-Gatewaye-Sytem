pragma solidity >=0.4.22 <0.8.0;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DummyERC20 is ERC20 {
    constructor(
        string memory tokenName,
        string memory tokenSymbol,
        uint256 initialSupply
    ) public ERC20(tokenName, tokenSymbol) {
        _mint(msg.sender, initialSupply);
    }
}
