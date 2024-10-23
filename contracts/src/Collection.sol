// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract Collection is ERC721 {
  string public name;
  int public cardCount;
  struct ModelCard {
      string pathImg;
      int cardNumber; 
  }


  constructor(string memory _name, int _cardCount) {
    name = _name;
    cardCount = _cardCount;
  }

  // les cards sont les tokens qu'on manipule
  uint[] public myCards; // public ?
  ModelCard[] public myModelCards; // public ?

  mapping (uint => Card) cardToModel; 

  mapping (uint => address) cardToOwner;  // propriété

  // je vois pas l'intérêt de ça, pourquoi pas le calculer sur le moment ? vu que ça coute cher d'écrire sur la blockchain.
  // j'ai juste copié zombieOwnership.sol donc je pense faut qu'il soit là, mais chelou
  mapping (address => uint) ownerCardCount;

  // utile pour transferFrom et approve
  mapping (uint => address) cardApprovals; 

  uint modelCardCount = 0;

  function _createModelCard(string pathImg) private returns() {
      myModelCards.push(ModelCard(pathImg, modelCardCount));
      modelCardCount++;
  }

  // créer une carte
  function _createCard(uint modelCardIndex) private returns(int) {
    // on return, ça va renvoyer l'indice de la nouvelle carte créé
    return myCards.push(modelCardIndex) - 1;
  }

  function _createRandomCard() private returns(int) {
      /* fonction imaginaire, c'est chaud de généré des nombres au hasard sur la blockchain */
      /* https://github.com/Yuvrajchandra/CryptoZombies-Solidity-Notes?tab=readme-ov-file#so-how-do-we-generate-random-numbers-safely-in-ethereum */
      return _createCard(random(0, myModelCards.lenght));
  }


  // fonctions de la norme ERC
  function balanceOf(address _owner) external view returns (uint256) {
    return ownerCardCount[_owner];
  }

  function ownerOf(uint256 _tokenId) external view returns (address) {
    return cardToOwner[_tokenId];
  }
  
  function _transfer(address _from, address _to, uint256 _tokenId) private {
    ownerCardCount[_to] = ownerCardCount[_to].add(1);
    ownerCardCount[msg.sender] = ownerCardCount[msg.sender].sub(1);
    cardToOwner[_tokenId] = _to;
    emit Transfer(_from, _to, _tokenId);
  }


  function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
      require (cardToOwner[_tokenId] == msg.sender || cardApprovals[_tokenId] == msg.sender);
      _transfer(_from, _to, _tokenId);
    }

  function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
      cardApprovals[_tokenId] = _approved;
      emit Approval(msg.sender, _approved, _tokenId);
    }
}
