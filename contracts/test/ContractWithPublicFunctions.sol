pragma solidity >=0.4.22 <0.8.0;

contract ContractWithPublicFunctions {
    string private _foo;
    uint256 private _bar;

    function setFoo(string memory foo) public returns (bool) {
        _foo = foo;
        return true;
    }

    function getFoo() public view returns (string memory) {
        return _foo;
    }

    function setBar(uint256 bar) public returns (bool) {
        _bar = bar;
        return true;
    }

    function getBar() public view returns (uint256) {
        return _bar;
    }

    function hushLinters() external {
        require(setFoo(getFoo()), "hush");
        require(setBar(getBar()), "hush");
    }
}
