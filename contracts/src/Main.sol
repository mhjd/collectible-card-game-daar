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
      int id = collection[CollectionId]._createModelCard(pathImg, numberOfCards);
      for (uint i = 0; i < numberOfThisCard; i++) {
	  collection[CollectionId]._createCard(id);
      }
      // for i in range numberofthiscard
      //    collections[CollectionId]._createCard(pathImg, cardNumber)
  }

  // est-ce que faudrait pas plutôt utiliser msg.sender ? plutôt que userId ?
  // du coup va falloir changer certain mapping, avec adress à la place de int
  function assignCardToUser(int userId, int cardNFTId) {
      CardIdToUser[cardNFTId] = userId; // pseudo code
  }

  // ouverture de deck
  function assignXCardsToUser(int userId, uint X) {
      for (uint i = 0; i < X; i++) {
	  assignCardsToUser(userId, getAvailableCard());
      }
  }
  

}
