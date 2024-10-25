// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./erc721.sol";

contract Collection is ERC721 {
    string public name;
    int public cardCount;
    struct ModelCard {
        string pathImg;
        int cardNumber;//Id du modèle
    }
    struct Card{
        int modelNumber;// Le modèle associé
        int cardId;//Id d'unicité
        address owner;//owner de la carte
    }


    constructor(string memory _name, int _cardCount) {
    name = _name;
    cardCount = _cardCount;
    }

   //INIT
    ModelCard[] public modelCards; // public ?
    Card[] public cards;

    //mapping (uint => address) cardToOwner;  // on skip pr l'instant pcq dans la struct

    // je vois pas l'intérêt de ça, pourquoi pas le calculer sur le moment ? vu que ça coute cher d'écrire sur la blockchain.
    // j'ai juste copié zombieOwnership.sol donc je pense faut qu'il soit là, mais chelou
    mapping (address => uint) ownerCardCount;

    // utile pour transferFrom et approve
    mapping (uint => address) cardApprovals;


    function _createModelCard(string _pathImg) private {
        modelCards.push(ModelCard(_pathImg, modelCards.length()));
    }

    // créer une carte
    function _createCard(uint _modelCardId) private returns(int) {
        // au return, ça va renvoyer l'indice de la nouvelle carte créée
        ownerCardCount[msg.sender]++;
        return cards.push(Card(_modelCardId, cards.length(), msg.sender));
    }

    function _createRandomCard() private returns(int) {
        /* fonction imaginaire, c'est chaud de générer des nombres au hasard sur la blockchain */
        /* https://github.com/Yuvrajchandra/CryptoZombies-Solidity-Notes?tab=readme-ov-file#so-how-do-we-generate-random-numbers-safely-in-ethereum */
        return _createCard(random(0, modelCards.length-1),msg.sender);
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


    function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
        require (cards[_tokenId].owner == msg.sender || cardApprovals[_tokenId] == msg.sender);
        _transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
        cardApprovals[_tokenId] = _approved;
        emit Approval(msg.sender, _approved, _tokenId);
    }
}
