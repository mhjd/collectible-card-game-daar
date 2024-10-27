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

    function assignCardToOwner(string memory _collectionName, address _owner, uint nft) private onlyAdmin returns(Collection.Card memory) {
      Collection collection = collections[getCollectionByName(_collectionName)];
      return collection.assignCard(nft, _owner);
    }

    function mint(string memory _collectionName,address _owner, string memory _modelCardId) public onlyAdmin returns(Collection.Card memory) {
      uint _collectionId = getCollectionByName(_collectionName);
      Collection collection = collections[_collectionId];
      uint nft = collection._createCard(_modelCardId);
      return assignCardToOwner(_collectionName, _owner, nft);
    }

    function assignRandomCardToOwner(string memory _collectionName, address _owner) private onlyAdmin returns(Collection.Card memory) {
        uint _collectionId = getCollectionByName(_collectionName);
      string memory randomModelId = collections[_collectionId].getRandomModelId();
      return mint(_collectionName, _owner, randomModelId);
    }

    // ouverture de booster
    function assignXRandomCardsToOwner(string memory _collectionName, address _owner, uint X) private onlyAdmin  returns(Collection.Card[] memory){
        Collection.Card[X] memory created_cards;
        for (uint i = 0; i < X; i++) {
          created_cards.push(assignRandomCardToOwner(_collectionName, _owner));
        }
        return created_cards;
    }

    function isOwnerOf (Collection.Card memory card, address _user) public pure returns(bool){
        return card.owner == _user;
    }

    error notAllCardsGet();

    function getUserCards(address _user) external view returns(Collection.Card[] memory){
        Collection.Card[] memory user_cards;

        for(uint i = 0; i<count; i++){
            Collection.Card[] memory current_nfts = collections[i].getCards();
            for(uint j = 0; j < current_nfts.length; j++){
                if(isOwnerOf(current_nfts[j],_user)){
                    user_cards[user_cards.length] = current_nfts[j];
                    if(collections[i].getOwnerCardCount(_user) == user_cards.length){
                    // Si c'était la derniere carte du user on peut s'arreter, on n'est pas sensés s'arrêter ailleurs
                        return user_cards;
                    }
                }
            }
        }
        revert notAllCardsGet();
    }

    function _test() public pure returns(uint) {
        return 777;
    }

  

}
