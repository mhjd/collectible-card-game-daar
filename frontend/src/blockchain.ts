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
