// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./erc721.sol";
import "./ownable.sol";


contract Collection is ERC721, Ownable {
    string public name;
    uint public cardCount;
    struct ModelCard {
        string cardNumber;//Id du modèle
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
    ModelCard[] public modelCards; // public ?
    Card[] public cards;

    //mapping (uint => address) cardToOwner;  // on skip pr l'instant pcq dans la struct

    // je vois pas l'intérêt de ça, pourquoi pas le calculer sur le moment ? vu que ça coute cher d'écrire sur la blockchain.
    // j'ai juste copié zombieOwnership.sol donc je pense faut qu'il soit là, mais chelou
    mapping (address => uint) public ownerCardCount;

    // utile pour transferFrom et approve
    mapping (uint => address) private cardApprovals;


    function _createModelCard(string memory _pathImg) public { //Un peu louche de la mettre public mais faudra voir avec la gestion de l'admin
        modelCards.push(ModelCard(_pathImg, modelCards.length()));
    }

    // créer une carte
    function _createCard(uint _modelCardId) public returns(uint) {
        // au return, ça va renvoyer l'indice de la nouvelle carte créée
        ownerCardCount[msg.sender]++;
        return cards.push(Card(_modelCardId, cards.length(), msg.sender));
    }

    function getRandomModelId() private view returns (uint) {
        // On choisit de générer les nombres aléatoires selon certains critères complexes.
        uint randomHash = uint(keccak256(abi.encodePacked(block.timestamp,msg.sender,block.difficulty)));
        return randomHash % modelCards.length;
    }

   function _createRandomCard() public returns(uint) {
        return cards.push(Card(getRandomModelId(),cards.length,msg.sender));
    }


    // fonctions de la norme ERC
    function balanceOf(address _owner) external view returns (uint256) {
        return ownerCardCount[_owner];
    }

    function ownerOf(uint256 _tokenId) external view returns (address) {
        return cards[_tokenId].owner;
    }
  
    function _transfer(address _from, address _to, uint256 _tokenId) private {
        ownerCardCount[_to]++;
        ownerCardCount[msg.sender]--;
        cards[_tokenId].owner = _to;
        emit Transfer(_from, _to, _tokenId);
    }

    function transfer(address _from, address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId){
        _transfer(_from, _to, _tokenId);
    }

    function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
        require (cards[_tokenId].owner == msg.sender || cardApprovals[_tokenId] == msg.sender);
        _transfer(_from, _to, _tokenId);
    }

    modifier onlyOwnerOf(uint256 _tokenId){
        require(cards[_tokenId].owner == msg.sender);
        _;
    }

    function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
        cardApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public{
        require(cardApprovals[_tokenId] == msg.sender);
        _transfer(cards[_tokenId].owner,msg.sender,_tokenId);
    }
}