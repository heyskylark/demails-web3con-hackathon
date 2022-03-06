//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Mailbox is Context, Ownable {
  mapping(address => string) private _mailboxes;
  string private _pendingInbox;
  uint256 private _totalInboxes;

  event RegisterUser(address sender, string mailboxStorage);
  event UpdatePendingInbox(string prevAddress, string currentAddress, address operator);
  
  constructor() {
      _totalInboxes = 0;
  }

  function getInbox(address addr) external view returns (string memory) {
      return _mailboxes[addr];
  }

  function addInbox(string memory mailboxStorage) external {
      require(bytes(_mailboxes[_msgSender()]).length == 0, "Mailbox already exists");

      _mailboxes[_msgSender()] = mailboxStorage;
      _totalInboxes += 1;

      emit RegisterUser(_msgSender(), mailboxStorage);
  }
  
  function updatePendingInbox(string memory inboxAddress) external onlyOwner() {
      
      string memory prevInbox = _pendingInbox;
      _pendingInbox = inboxAddress;

      emit UpdatePendingInbox(prevInbox, _pendingInbox, _msgSender());
  }
  
  function pendingInbox() public view returns (string memory) {
      return _pendingInbox;
  }
  function totalInboxes() public view returns (uint256) {
      return _totalInboxes;
  }
}