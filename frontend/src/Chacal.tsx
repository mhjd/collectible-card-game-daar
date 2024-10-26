import React, { useState } from 'react';
import styles from './styles.module.css';
import Web3 from 'web3';


const web3 = new Web3("http://127.0.0.1:8545");

const Chacal: React.FC = () => {
  const [integer, setInteger] = useState<number | null>(null);
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
  ]
  const contractAdress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"
  const chacal = new web3.eth.Contract(myAbi, contractAdress);

  async function getInteger() {
    try {
      console.log("Calling _test() on contract at:", contractAdress);
      const accounts = await web3.eth.getAccounts();
      console.log("Connected account:", accounts[0]);
      
      const result = await chacal.methods._test().call({
        from: accounts[0]
      });
      console.log("Result from _test():", result);
      return result;
    } catch (error) {
      console.error('Error calling _test():', error);
      return null;
    }
  }

  async function createCollectionHardCoded() {
    try {
      console.log("Calling _createCollectionHardCoded() on contract at:", contractAdress);
      const accounts = await web3.eth.getAccounts();
      console.log("Connected account:", accounts[0]);
	const name = "cachalot";
	await chacal.methods.createCollection(name, 10)
        .send({ from: accounts[0] })
        .on("receipt", function (receipt) {
          $("#txStatus").text("Successfully created " + name + "!");
        })
        .on("error", function (error) {

          $("#txStatus").text(error);
        });
	      
      return result;
    } catch (error) {
      console.error('Error calling createCollection():', error);
      return null;
    }
  }

    async function addModelCardToCollectionHardCoded()  {
	try {
      console.log("Calling _addModelCardToCollectionHardCoded() on contract at:", contractAdress);
      const accounts = await web3.eth.getAccounts();
      console.log("Connected account:", accounts[0]);
	const nameCollection = "cachalot";
	const nameModelCard = "machinchouette";
	await chacal.methods.addModelCard(name, nameModelCard)
        .send({ from: accounts[0] })
        .on("receipt", function (receipt) {
          $("#txStatus").text("Successfully created " + nameModelCard + "!");
        })
        .on("error", function (error) {

          $("#txStatus").text(error);
        });
	      
      return result;
    } catch (error) {
      console.error('Error calling addModelCardToCollectionHardCoded():', error);
      return null;
    }
	
    }
  
    async function retrieveAllCollectionName() {

      const accounts = await web3.eth.getAccounts();
	const myCollections = await chacal.methods.getCollectionsByName("cachalot").call({
        from: accounts[0]
      });
       console.log(myCollections);
	
    }
  
  const retrieveIntegerAndPrintIt = async () => {
    const value = await getInteger();
    setInteger(value);
  };

  return (
    <div className={styles.body}>
      <h1>Test connection with solidity</h1>
      <button className={styles.button} onClick={retrieveIntegerAndPrintIt}>Click on me to retrieve a integer</button>
      <button className={styles.button} onClick={createCollectionHardCoded}>Click on me to create a collection hard coded</button>
      <button className={styles.button} onClick={retrieveAllCollectionName}>Click on me to retrieveAllCollectionName</button>
      {integer !== null && <p>Retrieved Integer: {integer}</p>}
    </div>
  );
};

export default Chacal;
