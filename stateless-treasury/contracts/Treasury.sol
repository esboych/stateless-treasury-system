// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract Treasury {
    address public owner;
    mapping(address => bool) public managers;
    mapping(uint256 => Claim) public claims;
    uint256 public nextClaimId;
    IERC20 public token;

    struct Claim {
        address claimant;
        uint256 amount;
        address[] approvals;
        bool withdrawn;
    }

    constructor(address _token) {
        owner = msg.sender;
        token = IERC20(_token);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyManager() {
        require(managers[msg.sender], "Not manager");
        _;
    }

    function addManager(address _manager) external onlyOwner {
        managers[_manager] = true;
    }

    function removeManager(address _manager) external onlyOwner {
        managers[_manager] = false;
    }

    address[] private emptyArray;
    function createClaim(uint256 _amount) external {
        claims[nextClaimId] = Claim({
            claimant: msg.sender,
            amount: _amount,
            approvals: emptyArray ,
            withdrawn: false
        });
        nextClaimId++;
    }

    function approveClaim(uint256 _claimId) external onlyManager {
        Claim storage claim = claims[_claimId];
        require(!claim.withdrawn, "Already withdrawn");

        for (uint256 i = 0; i < claim.approvals.length; i++) {
            require(claim.approvals[i] != msg.sender, "Already approved");
        }

        claim.approvals.push(msg.sender);

        if (claim.approvals.length >= 2) {
            claim.withdrawn = true;
            require(token.transfer(claim.claimant, claim.amount), "Transfer failed");
        }
    }
}
