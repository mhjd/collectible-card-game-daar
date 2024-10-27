import React, { useState, useEffect } from 'react';
import pokemon from 'pokemontcgsdk';
import styles from './styles.module.css';
import CollectionGrid from './CollectionGrid';
import BoosterResult from './BoosterResult';
import { initBlockchain, getBlockchainCollections, openABooster } from './blockchain';


interface OpenBoosterProps {
  sets: any[];
}

const OpenBooster: React.FC<OpenBoosterProps> = ({ sets }) => {
  const [blockchainCollections, setBlockchainCollections] = useState<string[]>([]);
  const [filteredSets, setFilteredSets] = useState<any[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSet, setSelectedSet] = useState<string>('');
  const [boosterResults, setBoosterResults] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await initBlockchain();
        const collections = await getBlockchainCollections();
        setBlockchainCollections(collections);
        
        if (collections.length > 0) {
          console.log('Fetching details for collections:', collections);
          
          // Fetch details for each collection
          const setDetails = await Promise.all(
            collections.map(async (collectionId) => {
              try {
                try {
                    const response = await pokemon.set.find(collectionId);
                    console.log(`Set data for ${collectionId}:`, response);
                    return response;
                } catch (apiError) {
                    console.error(`API error for set ${collectionId}:`, apiError);
                    return {
                        id: collectionId,
                        name: collectionId,
                        images: { logo: null, symbol: null }
                    };
                }
              } catch (error) {
                console.error(`Error fetching set ${collectionId}:`, error);
                return {
                  id: collectionId,
                  name: collectionId,
                  images: { logo: null }
                };
              }
            })
          );
          
          console.log('Final set details:', setDetails);
          setFilteredSets(setDetails);
        }
      } catch (error) {
        console.error('Error initializing:', error);
        setFilteredSets([]);
      }
    };
    init();
  }, []);

  const handleCollectionClick = (collectionId: string) => {
    setSelectedSet(collectionId);
    setShowConfirm(true);
  };

  const handleConfirmOpen = async () => {
    setShowConfirm(false);
    try {
      const cards = await openABooster(selectedSet);
      setBoosterResults(cards);
      setShowResults(true);
    } catch (error) {
      console.error('Error opening booster:', error);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <h1>Open Booster</h1>
        <CollectionGrid 
          collections={blockchainCollections}
          onCollectionClick={handleCollectionClick}
          sets={filteredSets}
        />

        {showConfirm && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>Confirm Opening</h2>
              <p>Are you sure you want to open a booster of {selectedSet} Set?</p>
              <div className={styles.modalButtons}>
                <button onClick={handleConfirmOpen}>Yes</button>
                <button onClick={() => setShowConfirm(false)}>No</button>
              </div>
            </div>
          </div>
        )}

        {showResults && (
          <BoosterResult 
            cards={boosterResults} 
            onClose={() => setShowResults(false)}
          />
        )}
      </div>
    </div>
  );
};

export default OpenBooster;
