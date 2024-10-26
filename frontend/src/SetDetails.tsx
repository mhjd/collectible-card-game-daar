import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from './styles.module.css'
import pokemon from 'pokemontcgsdk'
import Web3 from 'web3'

const web3 = new Web3("http://127.0.0.1:8545");

const SetDetails = () => {
  const { setId } = useParams<{ setId: string }>()
  const [cards, setCards] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [addingCollection, setAddingCollection] = useState(false)

  const myAbi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "NameNotExisting",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "_test",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_collectionName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_cardNumber",
          "type": "string"
        }
      ],
      "name": "addModelCard",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "cardCount",
          "type": "uint256"
        }
      ],
      "name": "createCollection",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "getCollectionByName",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCollections",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "isOwner",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
  
  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
  const contract = new web3.eth.Contract(myAbi, contractAddress)

  const addCollectionToBlockchain = async () => {
    if (!setId) return;
    
    try {
      setAddingCollection(true);
      const accounts = await web3.eth.getAccounts();
      
      await contract.methods.createCollection(setId, cards.length)
        .send({ from: accounts[0] });

      for (const card of cards) {
        try {
          await contract.methods.addModelCard(setId, card.id)
            .send({ from: accounts[0] });
          console.log(`Added card ${card.id} to collection ${setId}`);
        } catch (cardError) {
          console.error(`Failed to add card ${card.id}:`, cardError);
        }
      }
      
      alert('Collection and cards added successfully!');
    } catch (error) {
      console.error('Error adding collection:', error);
      alert('Failed to add collection');
    } finally {
      setAddingCollection(false);
    }
  }

  useEffect(() => {
    if (setId) {
      pokemon.card.where({ q: `set.id:${setId}` })
        .then(result => setCards(result.data))
        .catch(error => console.error('Error fetching Pokémon cards:', error))
    }
  }, [setId])

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={styles.body}>
      <h1>Cards in Set: {setId}</h1>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search cards by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      <button 
        className={styles.button}
        onClick={addCollectionToBlockchain}
        disabled={addingCollection}
      >
        {addingCollection ? 'Adding...' : 'Add this Collection'}
      </button>
      <div className={styles.cardGrid}>
        {cards.length > 0 ? (
          filteredCards.map(card => (
            <div key={card.id} className={styles.cardItem}>
              <h2>{card.name}</h2>
              <img 
                src={card.images.small} 
                alt={card.name} 
                style={{ width: '240px', height: '330px', objectFit: 'contain' }}
              />
            </div>
          ))
        ) : (
          <p>Loading cards...</p>
        )}
      </div>
    </div>
  )
}

export default SetDetails
