// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";
import "./ownable.sol";

contract Main is Ownable {
    uint private count;
    mapping(uint => Collection) private collections;

    constructor() onlyAdmin {
        count = 0;
    }

    function createCollection(string calldata name, uint cardCount) external onlyAdmin {
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

    function addModelCard(string memory _collectionName, string memory _cardNumber) external onlyAdmin {
      collections[getCollectionByName(_collectionName)]._createModelCard(_cardNumber);
    }

    function getCollections() public view returns(string[] memory){
        string[] memory res = new string[](count);
        for(uint i = 0; i < count;i++){
            res[i] = collections[i].name();
        }
        return res;
    }

    function assignCardToOwner(uint _collectionId, address _owner, uint nft) private onlyAdmin {
      Collection collection = collections[_collectionId];
      collection.assignCard(nft, _owner);
    }

    function mint(string memory _collectionName,address _owner, string memory _modelCardId) public onlyAdmin {
      uint _collectionId = getCollectionByName(_collectionName);
      Collection collection = collections[_collectionId];
      uint nft = collection._createCard(_modelCardId);
      assignCardToOwner(_collectionId, _owner, nft);
    }

    function assignRandomCardToOwner(uint _collectionId, address _owner) private onlyAdmin {
      uint randomNft = collections[_collectionId].getRandomModelId();
      assignCardToOwner(_collectionId, _owner, randomNft);
    }

    // ouverture de booster
    function assignXRandomCardsToOwner(uint _collectionId, address _owner, uint X) private onlyAdmin {
      for (uint i = 0; i < X; i++) {
          assignRandomCardToOwner(_collectionId, _owner);
      }
    }

    function _test() public pure returns(uint) {
        return 777;
    }

  

}
