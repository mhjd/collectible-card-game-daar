import React, { useState, useEffect } from 'react';
import pokemon from 'pokemontcgsdk';
import styles from './styles.module.css';
import CollectionGrid from './CollectionGrid';
import { initBlockchain, getBlockchainCollections } from './blockchain';


interface OpenBoosterProps {
  sets: any[];
}

const OpenBooster: React.FC<OpenBoosterProps> = ({ sets }) => {
  const [blockchainCollections, setBlockchainCollections] = useState<string[]>([]);
  const [filteredSets, setFilteredSets] = useState<any[]>([]);

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
    console.log('Selected collection:', collectionId);
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
      </div>
    </div>
  );
};

export default OpenBooster;
