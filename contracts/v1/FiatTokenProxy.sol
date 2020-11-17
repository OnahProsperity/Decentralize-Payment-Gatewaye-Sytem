pragma solidity >=0.4.22 <0.8.0;

import {
    AdminUpgradeabilityProxy
} from "../upgradeability/AdminUpgradeabilityProxy.sol";

/**
 * @title FiatTokenProxy
 * @dev This contract proxies FiatToken calls and enables FiatToken upgrades
 */
contract FiatTokenProxy is AdminUpgradeabilityProxy {
    constructor(address implementationContract)
        public
        AdminUpgradeabilityProxy(implementationContract)
    {}
}
