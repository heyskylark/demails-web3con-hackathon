//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract Mailbox is Context {
  mapping(address => string) private mailboxes;

  event RegisterUser(address sender, string mailboxStorage);
  
  constructor() {
    // what should we do on deploy?
  }

  function getUserInbox() external view returns (string memory) {
    console.log(mailboxes[_msgSender()]);
    return mailboxes[_msgSender()];
  }

  function registerUser(string memory mailboxStorage) external {
      mailboxes[_msgSender()] = mailboxStorage;
      console.log(_msgSender(), mailboxStorage);
      emit RegisterUser(_msgSender(), mailboxStorage);
  }

  // to support receiving ETH by default
  receive() external payable {}
  fallback() external payable {}
}