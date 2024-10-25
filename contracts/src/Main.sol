// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "./ownable.sol";

contract Main is Ownable {
  int private count;
  mapping(uint => Collection) private collections;

  constructor() {
    count = 0;
  }

  /* external ? c'était ça de base. Bizarre, external veut dire public mais peut pas être appelé à l'intérieur */
  /* j'aurais plutôt dit "private" perso, à moins qu'il faut que ça communique avec d'autre contrat */
  function createCollection(string calldata name, int cardCount) external onlyOwner {
    collections[count++] = new Collection(name, cardCount);
  }

  function addModelCard(uint CollectionId, string pathImg) private onlyOwner {
      collections[CollectionId]._createModelCard(pathImg);
  }

  function mint(uint _collectionId, address _owner) private onlyOwner(){

  }

  function assignCardToOwner(uint _collectionId, address _owner, uint nft) private onlyOwner {
      collections[_collectionId].cards[nft].owner = _owner;
      collections[_collectionId].ownerCardCount[_owner]++; // On l'initialise nulle part mais normal en solidity je crois
  }

  function assignRandomCardToOwner(uint _collectionId, address _owner) private onlyOwner {
      assignCardToOwner( );
  }

  // ouverture de deck
  function assignXRandomCardsToOwner(int userId, uint X) private onlyOwner {
      for (uint i = 0; i < X; i++) {
	  assignRandomCardToOwner(userId);
      }
  }
  

}
