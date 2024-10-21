// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract Collection is ERC721 {
  string public name;
  int public cardCount;
  struct ModelCard {
      string pathImg;
      int cardNumber; // c'est l'id ?
  }


  uint[] public myCards; // public ?
  ModelCard[] public myModelCards; // public ?

  mapping (uint => Card) CardIdToCard; 
  // j'ai un doute, est-ce qu'on fait pas ID vers iD ?
  // Non, ça n'a pas de sens

  mapping (uint => uint) CardIdToUser;  // propriété

  uint modelCardCount = 0;
  function _createModelCard(string pathImg) returns(int) {
      int id = modelCardCount;
      myModelCards.push(ModelCard(pathImg, id));
      modelCardCount++;
      return id;
  }
  function _createCard(int cardNumber) returns(int) {
    /* return myCards.push(Card(pathImg, cardNumber)) - 1; */
    uint id = myCards.push(cardNumber) - 1;
    
    return id;
    // zombieToOwner[id] = msg.sender; // faudra l'implémenter ça, vu que chaque carte est unique
    // ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].add(1);
  }

  constructor(string memory _name, int _cardCount) {
    name = _name;
    cardCount = _cardCount;
  }

  // il faut ajouter les fonction de la norme ERC

}
