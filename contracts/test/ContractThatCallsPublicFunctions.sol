pragma solidity >=0.4.22 <0.8.0;

import { ContractWithPublicFunctions } from "./ContractWithPublicFunctions.sol";

contract ContractThatCallsPublicFunctions {
    function callSetFoo(address contractAddress, string calldata foo)
        external
        returns (bool)
    {
        return ContractWithPublicFunctions(contractAddress).setFoo(foo);
    }

    function callGetFoo(address contractAddress)
        external
        view
        returns (string memory)
    {
        return ContractWithPublicFunctions(contractAddress).getFoo();
    }

    function callSetBar(address contractAddress, uint256 bar)
        external
        returns (bool)
    {
        return ContractWithPublicFunctions(contractAddress).setBar(bar);
    }

    function callGetBar(address contractAddress)
        external
        view
        returns (uint256)
    {
        return ContractWithPublicFunctions(contractAddress).getBar();
    }
}
