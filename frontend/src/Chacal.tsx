import React, { useState } from 'react';
import styles from './styles.module.css';
import CollectionGrid from './CollectionGrid';
import { getContract, getAccounts, getContractAddress } from './web3Utils';


const Chacal: React.FC = () => {
  const [integer, setInteger] = useState<number | null>(null);
  
  const chacal = getContract();
  const contractAdress = getContractAddress();
  const [accounts, setAccounts] = useState<string[]>([]);

  React.useEffect(() => {
    const init = async () => {
      const accs = await getAccounts();
      setAccounts(accs);
    };
    init();
  }, []);
  
  async function getInteger() {
    try {
      console.log("Calling _test() on contract at:", contractAdress);
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
      console.log("Connected account:", accounts[0]);
	const name = "cachalot2";
	await chacal.methods.createCollection(name, 10)
        .send({ from: accounts[0] })
        .on("receipt", function (receipt) {
          console.log("Successfully created " + name + "!");
        })
        .on("error", function (error) {
          console.error(error);
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
      console.log("Connected account:", accounts[0]);
	const nameCollection = "cachalot2";
	const nameModelCard = "machinchouette";
	await chacal.methods.addModelCard(nameCollection, nameModelCard)
        .send({ from: accounts[0] })
        .on("receipt", function (receipt) {
          console.log("Successfully created " + nameModelCard + "!");
        })
        .on("error", function (error) {
          console.error(error);
        });
	      
      return result;
    } catch (error) {
      console.error('Error calling addModelCardToCollectionHardCoded():', error);
      return null;
    }
	
    }
  
    async function retrieveAllCollectionName() {
      try {
        const collections = await chacal.methods.getCollections().call({
          from: accounts[0]
        });
        console.log("All collections:", collections);
      } catch (error) {
        console.error("Error retrieving collections:", error.message);
      }
    }
  
    const retrieveIntegerAndPrintIt = async () => {
      const value = await getInteger();
      setInteger(value);
    };


    const testingCollection_Modelcard_Card = async () => {
	console.log("enter in function")
        try {
            const nameCollection = "maCollection";
	    
	    console.log("blocked?");
            await chacal.methods.createCollection(nameCollection, 10)
		.send({ from: accounts[0] })
		.on("receipt", function (receipt) {
                    console.log("Successfully created " + nameCollection + "!");
		});
	    console.log("yes...");
	    
	    console.log("Coll created")
            const nameModelCard = "monModeleCard";
	    
            await chacal.methods.addModelCard(nameCollection, nameModelCard)
		.send({ from: accounts[0] })
		.on("receipt", function (receipt) {
                    console.log("Successfully created " + nameModelCard + "!");
		});
	    
	    console.log("model created")
            await chacal.methods.mint(nameCollection, accounts[0], nameModelCard)
		.send({ from: accounts[0] })
		.on("receipt", function (receipt) {
                    console.log("Successfully created the NFT!");
		});
	    
	    console.log("card created")
	} catch (error) {
            console.error(error.message);
	}
    }


  return (
    <div className={styles.body}>
      <h1>Test connection with solidity</h1>
      <button className={styles.button} onClick={retrieveIntegerAndPrintIt}>Click on me to retrieve a integer</button>
      <button className={styles.button} onClick={createCollectionHardCoded}>Click on me to create a collection hard coded</button>
      <button className={styles.button} onClick={retrieveAllCollectionName}>Click on me to retrieveAllCollectionName</button>
      <button className={styles.button} onClick={addModelCardToCollectionHardCoded}>Click on me to addModelCardToCollectionHardCoded</button>
      <button className={styles.button} onClick={testingCollection_Modelcard_Card}>Click on me to test top down</button>

      {integer !== null && <p>Retrieved Integer: {integer}</p>}
    </div>
  );
};

export default Chacal;
