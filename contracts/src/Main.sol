// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "./ownable.sol";

contract Main is Ownable {
  uint private count;
  mapping(uint => Collection) private collections;

  constructor() {
    count = 0;
  }

  /* external ? c'était ça de base. Bizarre, external veut dire public mais peut pas être appelé à l'intérieur */
  /* j'aurais plutôt dit "private" perso, à moins qu'il faut que ça communique avec d'autre contrat */
  function createCollection(string calldata name, uint cardCount) external onlyOwner {
    collections[count++] = new Collection(name, cardCount);
  }

    error NameNotExisting();

  function getCollectionByName(string memory _name) private view returns(uint){
      for(uint i = 0; i<count ; i++){
          if(keccak256(abi.encodePacked(collections[i].name())) == keccak256(abi.encodePacked(_name))){
              return i;
          }
      }
      revert NameNotExisting();
  }

  function addModelCard(string memory _collectionName, string memory _cardNumber) private onlyOwner {
      collections[getCollectionByName(_collectionName)]._createModelCard(_cardNumber);
  }

  function mint(uint _collectionId, address _owner) private onlyOwner(){

  }

    function getCollections() public view returns(string[] memory){
        string[] memory res = new string[](count);
        for(uint i = 0; i < count;i++){
            res[i] = collections[i].name();
        }
        return res;
    }

  function assignCardToOwner(uint _collectionId, address _owner, uint nft) private onlyOwner {
      Collection collection = collections[_collectionId];
      collection.assignCard(nft, _owner);
  }

  function assignRandomCardToOwner(uint _collectionId, address _owner) private onlyOwner {
      uint randomNft = collections[_collectionId].getRandomModelId();
      assignCardToOwner(_collectionId, _owner, randomNft);
  }

  // ouverture de deck
  function assignXRandomCardsToOwner(uint _collectionId, address _owner, uint X) private onlyOwner {
      for (uint i = 0; i < X; i++) {
          assignRandomCardToOwner(_collectionId, _owner);
      }
  }

    function _test() public pure returns(uint) {
        return 777;
    }

  

}
