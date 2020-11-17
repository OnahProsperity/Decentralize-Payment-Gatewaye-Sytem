pragma solidity >=0.4.22 <0.8.0;

contract ContractWithExternalFunctions {
    string private _foo;
    uint256 private _bar;

    function setFoo(string calldata foo) external returns (bool) {
        _foo = foo;
        return true;
    }

    function getFoo() external view returns (string memory) {
        return _foo;
    }

    function setBar(uint256 bar) external returns (bool) {
        _bar = bar;
        return true;
    }

    function getBar() external view returns (uint256) {
        return _bar;
    }
}
