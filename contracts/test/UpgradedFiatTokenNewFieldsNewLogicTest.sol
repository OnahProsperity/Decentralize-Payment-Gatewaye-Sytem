pragma solidity >=0.4.22 <0.8.0;

import { FiatTokenV1 } from "../v1/FiatTokenV1.sol";

/**
 * @title UpgradedFiatTokenNewFieldsNewLogicTest
 * @dev ERC20 Token backed by fiat reserves
 */
contract UpgradedFiatTokenNewFieldsNewLogicTest is FiatTokenV1 {
    bool public newBool;
    address public newAddress;
    uint256 public newUint;
    bool internal initializedV2;

    function initialize(
        string calldata tokenName,
        string calldata tokenSymbol,
        string calldata tokenCurrency,
        uint8 tokenDecimals,
        address newMasterMinter,
        address newPauser,
        address newBlacklister,
        address newOwner,
        bool _newBool,
        address _newAddress,
        uint256 _newUint
    ) external {
        super.initialize(
            tokenName,
            tokenSymbol,
            tokenCurrency,
            tokenDecimals,
            newMasterMinter,
            newPauser,
            newBlacklister,
            newOwner
        );
        initV2(_newBool, _newAddress, _newUint);
    }

    function initV2(
        bool _newBool,
        address _newAddress,
        uint256 _newUint
    ) public {
        require(!initializedV2, "contract is already initialized");
        newBool = _newBool;
        newAddress = _newAddress;
        newUint = _newUint;
        initializedV2 = true;
    }

    function setNewAddress(address _newAddress) external {
        newAddress = _newAddress;
    }
}
