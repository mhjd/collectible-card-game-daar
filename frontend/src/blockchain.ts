import { getContract, getAccounts, getContractAddress } from './web3Utils';

let accounts: string[] = [];
const contract = getContract();
const contractAddress = getContractAddress();

export const initBlockchain = async () => {
  accounts = await getAccounts();
  return accounts;
};

export const getBlockchainCollections = async () => {
  try {
    return await contract.methods.getCollections().call({
      from: accounts[0]
    });
  } catch (error) {
    console.error('Error fetching blockchain collections:', error);
    return [];
  }
};

export const openABooster = async (collectionId: string): Promise<string[]> => {
  try {
      console.log("collection : ", collectionId);
const numCards = 10;

    await contract.methods
      .assignXRandomCardsToOwner(collectionId, accounts[0], numCards)
      .send({ from: accounts[0] });
    
    const cards = await contract.methods
      .getLastAssignedCards(accounts[0])
      .call({ from: accounts[0] });
   

    
      console.log("affichage : ")
      
      console.log("contenu : ", cards)
    return cards;
  } catch (error) {
    console.error('Error opening booster:', error);
    return [];
  }
}

export const addCollectionToBlockchain = async (setId: string, cards: any[]) => {
  try {
    await contract.methods.createCollection(setId, cards.length)
      .send({ from: accounts[0] });

    for (const card of cards) {
      try {
        await contract.methods.addModelCard(setId, card.id)
          .send({ from: accounts[0] });
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
    const cards = await contract.methods.getUserCards(address)
      .call({ from: accounts[0] });
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
    const cards = await contract.methods.getUserCards(accounts[0])
      .call({ from: accounts[0] });
    console.log(cards);
    return cards.map(card => card.modelNumber);
  } catch (error) {
    console.error('Error fetching user cards:', error);
    return [];
  }
};
