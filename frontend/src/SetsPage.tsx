import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import CollectionGrid from './CollectionGrid';

import { initBlockchain, getBlockchainCollections } from './blockchain';

interface SetsPageProps {
  sets: any[];
}

export const SetsPage: React.FC<SetsPageProps> = ({ sets }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const gridRef = useRef<HTMLUListElement>(null);
  const [blockchainCollections, setBlockchainCollections] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
      await initBlockchain();
      const collections = await getBlockchainCollections();
      setBlockchainCollections(collections);
    };
    init();
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
        <CollectionGrid 
          collections={sets.map(set => set.id)}
          showAsLinks={true}
          sets={sets}
          additionalInfo={sets.reduce((acc, set) => ({
            ...acc,
            [set.id]: {
              color: blockchainCollections.includes(set.id) ? 'green' : 'inherit'
            }
          }), {})}
        />
      </div>
    </div>
  );
};
