// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenMigrator {
  ERC20 public oldToken;
  ERC20 public newToken;

  event Migrate(address indexed owner, uint256 amount);
  event Rollback(address indexed owner, uint256 amount);

  constructor(address _oldToken, address _newToken) {
    oldToken = ERC20(_oldToken);
    newToken = ERC20(_newToken);
  }

  function migrate(uint256 amount) external returns(bool) {
    oldToken.transferFrom(msg.sender, address(this), amount);
    newToken.transfer(msg.sender, amount);

    emit Migrate(msg.sender, amount);
    return true;
  }

  function rollback(uint256 amount) external returns(bool) {
    newToken.transferFrom(msg.sender, address(this), amount);
    oldToken.transfer(msg.sender, amount);

    emit Rollback(msg.sender, amount);
    return true;
  }
}