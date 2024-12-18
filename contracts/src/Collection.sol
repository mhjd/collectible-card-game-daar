// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./erc721.sol";
import "./ownable.sol";


contract Collection is ERC721, Ownable {
    string public name;
    uint public cardCount;
    struct ModelCard {
        string cardNumber; //Id du modèle
    }
    struct Card{
        string modelNumber;// Le modèle associé
        uint cardId;//Id d'unicité
        address owner;//owner de la carte
    }

    constructor(string memory _name, uint _cardCount) {
    name = _name;
    cardCount = _cardCount;
    }

   //INIT
    ModelCard[] public modelCards;
    Card[] public cards;

    function getCard(uint index) external view returns(Card memory){
        return cards[index];
    }

    function getCardsLength() external view returns(uint){
        return cards.length;
    }

    mapping (address => uint) public ownerCardCount;

    function getOwnerCardCount(address _owner) external view returns(uint) {
        return ownerCardCount[_owner];
    }

    // utile pour transferFrom et approve
    mapping (uint => address) private cardApprovals;


    function _createModelCard(string memory _cardNumber) public onlyOwner() {
        modelCards.push(ModelCard( _cardNumber));
    }

    // créer une carte
    function _createCard(string memory _modelCardId) public returns(uint){
        // au return, ça va renvoyer l'indice de la nouvelle carte créée
        ownerCardCount[msg.sender]++;
        cards.push(Card(_modelCardId, cards.length, msg.sender));
        return cards.length - 1;// Retourne l'indice de la carte ajoutée
    }

    uint private randNonce = 0;

    function getRandomModelId() public returns(string memory) {
        // On choisit de générer les nombres aléatoires selon certains critères complexes.
        randNonce++;
        uint randomHash = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce)));
        return modelCards[randomHash % modelCards.length].cardNumber;
    }

   function _createRandomCard() public {
        cards.push(Card(getRandomModelId(), cards.length, msg.sender));
   }

    // fonctions de la norme ERC
    function balanceOf(address _owner) override external view returns (uint256) {
        return ownerCardCount[_owner];
    }

    function ownerOf(uint256 _tokenId) override external view returns (address) {
        return cards[_tokenId].owner;
    }
  
    function _transfer(address _from, address _to, uint256 _tokenId) private {
        ownerCardCount[_to]++;
        ownerCardCount[msg.sender]--;
        cards[_tokenId].owner = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transfer(address _to, uint256 _tokenId) override public {
        _transfer(msg.sender, _to, _tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) override external payable {
        require (cards[_tokenId].owner == msg.sender || cardApprovals[_tokenId] == msg.sender);
        _transfer(_from, _to, _tokenId);
    }

    modifier onlyOwnerOf(uint256 _tokenId){
        require(cards[_tokenId].owner == msg.sender);
        _;
    }

    function approve(address _approved, uint256 _tokenId) override external payable onlyOwnerOf(_tokenId) {
        cardApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public{
        require(cardApprovals[_tokenId] == msg.sender);
        _transfer(cards[_tokenId].owner,msg.sender,_tokenId);
    }

    function assignCard(uint256 _tokenId, address _to) public onlyOwner returns(Card memory) {
        cards[_tokenId].owner = _to;
        ownerCardCount[_to]++;
        return cards[_tokenId];
    }
}
