// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";

contract Main {
  int private count;
  mapping(int => Collection) private collections;

  constructor() {
    count = 0;
  }

  function createCollection(string calldata name, int cardCount) external {
    collections[count++] = new Collection(name, cardCount);
  }

  function addCardToCollection(int CollectionId, string pathImg, int cardNumber, int numberOfThisCard) {
      // for i in range numberofthiscard
      //    collections[CollectionId]._createCard(pathImg, cardNumber)
  }

  function assignCardToUser(int userId, int cardNFTId) {
      CardIdToUser[cardNFTId] = userId; // pseudo code
  }
}
