import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

interface SetsPageProps {
  sets: any[];
}

export const SetsPage: React.FC<SetsPageProps> = ({ sets }) => {
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const gridRef = useRef<HTMLUListElement>(null);

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
    const images = document.querySelectorAll('.${styles.setLogo}');
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
        <ul className={`${styles.setGrid} ${styles.noListStyle}`} ref={gridRef}>
        {sets.map((set, index) => (
          <li 
            key={index} 
            className={styles.setItem}
            style={{ height: maxHeight ? `${maxHeight + 60}px` : 'auto' }} // Added padding for the title
          >
            <Link to={`/set/${set.id}`} className={styles.setLink}>
              <h2 className={styles.setName}>{set.name}</h2>
              <img src={set.images.logo} alt={set.name} className={styles.setLogo} />
            </Link>
          </li>
        ))}
        </ul>
      </div>
    </div>
  );
};
