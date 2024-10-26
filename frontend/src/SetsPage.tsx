import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import Web3 from 'web3';

interface SetsPageProps {
  sets: any[];
}

const web3 = new Web3("http://127.0.0.1:8545");

export const SetsPage: React.FC<SetsPageProps> = ({ sets }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const gridRef = useRef<HTMLUListElement>(null);
  const [blockchainCollections, setBlockchainCollections] = useState<string[]>([]);

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
  ];

  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const contract = new web3.eth.Contract(myAbi, contractAddress);

  useEffect(() => {
    const fetchBlockchainCollections = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        const collections = await contract.methods.getCollections().call({
          from: accounts[0]
        });
        setBlockchainCollections(collections);
      } catch (error) {
        console.error('Error fetching blockchain collections:', error);
      }
    };

    fetchBlockchainCollections();
  }, []);

  useEffect(() => {
    const updateMaxHeight = () => {
      if (!gridRef.current) return;
      
      const images = gridRef.current.getElementsByTagName('img');
      let maxH = 0;

      Array.from(images).forEach((img) => {
        if (img.height > maxH) {
          maxH = img.height;
        }
      });

      setMaxHeight(maxH);
    };

    // Initial calculation
    updateMaxHeight();

    // Add load event listeners to all images
    const images = document.querySelectorAll(`.${styles.setLogo}`);
    images.forEach(img => {
      img.addEventListener('load', updateMaxHeight);
    });

    // Cleanup
    return () => {
      images.forEach(img => {
        img.removeEventListener('load', updateMaxHeight);
      });
    };
  }, [sets]);

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <h1>Pokemon TCG Sets</h1>
        <form 
          className={styles.searchContainer}
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            }
          }}
        >
          <input
            type="text"
            placeholder="Search for any Pokemon card..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </form>
        <ul className={`${styles.setGrid} ${styles.noListStyle}`} ref={gridRef}>
        {sets.map((set, index) => (
          <li 
            key={index} 
            className={styles.setItem}
            style={{ 
              height: maxHeight ? `${maxHeight + 60}px` : 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Link 
              to={`/set/${set.id}`} 
              className={styles.setLink}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%'
              }}
            >
              <h2 
                className={styles.setName} 
                style={{ 
                  marginBottom: '10px',
                  color: blockchainCollections.includes(set.id) ? 'green' : 'inherit'
                }}
              >
                {set.name}
              </h2>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <img src={set.images.logo} alt={set.name} className={styles.setLogo} />
              </div>
            </Link>
          </li>
        ))}
        </ul>
      </div>
    </div>
  );
};
