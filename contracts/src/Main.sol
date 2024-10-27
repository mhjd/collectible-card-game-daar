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
    function assignXRandomCardsToOwner(string memory _collectionName, address _owner, uint nb) public onlyAdmin  returns(string[] memory){
        string[] memory model_cards_of_nft_generated = new string[](nb);
        Collection.Card memory myCard;
        for (uint i = 0; i < nb; i++) {
            myCard = assignRandomCardToOwner(_collectionName, _owner);
            model_cards_of_nft_generated[i] = myCard.modelNumber;
        }
        return model_cards_of_nft_generated;
    }

    function isOwnerOf (Collection.Card memory card, address _user) public pure returns(bool){
        return card.owner == _user;
    }

    function getTotalCardsOfUser(address _user) private view returns(uint){
        uint res = 0;
        for(uint i = 0; i < count ; i++){
            res = res + collections[i].getOwnerCardCount(_user);
        }
        return res;
    }

    function getUserCards(address _user) external view returns(Collection.Card[] memory){
        uint totalCards = getTotalCardsOfUser(_user);
        Collection.Card[] memory user_cards = new Collection.Card[](totalCards);

        for(uint i = 0; i<count; i++){
            uint cpt = 0;
            uint cptMax = collections[i].getOwnerCardCount(_user);
            uint length = collections[i].getCardsLength();
            for(uint j = 0; j < length; j++){
                if(cpt == cptMax){
                    // Si c'était la derniere carte du user on peut s'arreter
                    j = length;
                }
                Collection.Card memory currentCard = collections[i].getCard(j);
                if(isOwnerOf(currentCard,_user)){
                    user_cards.push(currentCard);
                    cpt++;
                }
            }
        }
        return user_cards;
    }

    function _test() public pure returns(uint) {
        return 777;
    }

  

}
