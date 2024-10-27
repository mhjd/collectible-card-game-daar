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

    // Vérifier si le compte est admin
    // const isAdmin = await contract.methods.isAdmin().call({ from: currentAccount });
    // if (!isAdmin) {
    //   throw new Error('Account is not admin');
    // }

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
