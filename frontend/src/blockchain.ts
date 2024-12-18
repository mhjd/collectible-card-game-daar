import { getContract, getAccounts, getContractAddress } from './web3Utils';
import Web3 from 'web3';

const web3 = new Web3("http://127.0.0.1:8545");

let accounts: string[] = [];
const contract = getContract();
const contractAddress = getContractAddress();

export const initBlockchain = async () => {
  accounts = await getAccounts();
  return accounts;
};

export const getBlockchainCollections = async () => {
  try {

    const currentAccount = (window as any).ethereum.selectedAddress;
    return await contract.methods.getCollections().call({
      from: currentAccount
    });
  } catch (error) {
    console.error('Error fetching blockchain collections:', error);
    return [];
  }
};

export const openABooster = async (collectionId: string): Promise<string[]> => {
  try {
    const currentAccount = (window as any).ethereum.selectedAddress;
    if (!currentAccount) {
      throw new Error('No MetaMask account connected');
    }


    console.log("collection : ", collectionId);
    const numCards = 10;
    
    await contract.methods
      .assignXRandomCardsToOwner(collectionId, currentAccount, numCards)
      .send({ from: currentAccount });
    
    const cards = await contract.methods
      .getLastAssignedCards(currentAccount)
      .call({ from: currentAccount });
   

    
      console.log("affichage : ")
      
      console.log("contenu : ", cards)
    return cards;
  } catch (error) {
    console.error('Error opening booster:', error);
    return [];
  }
}



export const buyCard = async (setId: string, cardId: string) => {
  try {
    const currentAccount = (window as any).ethereum.selectedAddress;
      await contract.methods.mint(setId, currentAccount, cardId)
      .send({ from: currentAccount , value: web3.utils.toWei('0.001', 'ether')});
    return true;
  } catch (error) {
    console.error('Error adding collection:', error);
    return false;
  }

}

export const addCollectionToBlockchain = async (setId: string, cards: any[]) => {
  try {
     
    const currentAccount = (window as any).ethereum.selectedAddress;

    // Vérifier si le compte est admin
    const isAdmin = await contract.methods.isAdmin().call({ from: currentAccount });
    if (!isAdmin) {
      throw new Error('Account is not admin');
    }
    await contract.methods.createCollection(setId, cards.length)
      .send({ from: currentAccount });

    for (const card of cards) {
      try {
        await contract.methods.addModelCard(setId, card.id)
          .send({ from: currentAccount });
      } catch (cardError) {
        console.error(`Failed to add card ${card.id}:`, cardError);
      }
    }
    return true;
  } catch (error) {
    console.error('Error adding collection:', error);
    return false;
  }
};

export const getUserCardsByAddress = async (address: string) => {
  try {

    const currentAccount = (window as any).ethereum.selectedAddress;
    const cards = await contract.methods.getUserCards(address)
      .call({ from: currentAccount });
    console.log(cards);
    return cards.map(card => card.modelNumber);
  } catch (error) {
    console.error('Error fetching user cards:', error);
    return [];
  }
};

export const getUserCardsOfUser = async () => {
  try {
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts available. Please initialize blockchain first.');
    }

    const currentAccount = (window as any).ethereum.selectedAddress;
    const cards = await contract.methods.getUserCards(currentAccount)
      .call({ from: currentAccount });
    console.log(cards);
    return cards.map(card => card.modelNumber);
  } catch (error) {
    console.error('Error fetching user cards:', error);
    return [];
  }
};
