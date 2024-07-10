// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts/utils/math/SafeMath.sol";
// import "../node_modules/OpenZeppelin/contracts/token/ERC20/ERC20.sol";
// import "../node_modules/OpenZeppelin/contracts/math/SafeMath.sol";

contract Token is ERC20 {
    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 1000000 * (10 ** uint256(decimals())));
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
