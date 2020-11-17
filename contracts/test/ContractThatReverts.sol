pragma solidity >=0.4.22 <0.8.0;

// solhint-disable no-unused-vars
// solhint-disable no-complex-fallback
// solhint-disable reason-string

contract ContractThatReverts {
    string private _reason;

    function setReason(string calldata reason) external {
        _reason = reason;
    }

    function reason() external view returns (string memory) {
        return _reason;
    }

    function revertNoReason() external pure {
        revert();
    }

    function revertWithReason(string calldata reasonMsg) external pure {
        revert(reasonMsg);
    }

    fallback() external payable {
        if (bytes(_reason).length > 0) {
            revert(_reason);
        }
        revert();
    }

    receive() external payable {
        if (bytes(_reason).length > 0) {
            revert(_reason);
        }
        revert();
    }
}
