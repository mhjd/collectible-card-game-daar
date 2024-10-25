// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";

contract Main is Ownable {
  int private count;
  mapping(int => Collection) private collections;

  constructor() {
    count = 0;
  }

  /* external ? c'était ça de base. Bizarre, external veut dire public mais peut pas être appelé à l'intérieur */
  /* j'aurais plutôt dit "private" perso, à moins qu'il faut que ça communique avec d'autre contrat */
  function createCollection(string calldata name, int cardCount) external onlyOwner {
    collections[count++] = new Collection(name, cardCount);
  }

  function addModelCard(int CollectionId, string pathImg) private onlyOwner {
      collections[CollectionId]._createModelCard(pathImg);
  }

  function assignCardToOwner(address _owner, int nft) private onlyOwner {
      CardToOwner[nft] = userId; 
      ownerCardCount[userId]++; // On l'initialise nulle part mais normal en solidity je crois
  }

  function assignRandomCardToOwner(address _owner) private onlyOwner {
      assignCardToOwner(userId, _createRandomCard());
  }

  // ouverture de deck
  function assignXRandomCardsToOwner(int userId, uint X) private onlyOwner {
      for (uint i = 0; i < X; i++) {
	  assignRandomCardToOwner(userId);
      }
  }
  

}
