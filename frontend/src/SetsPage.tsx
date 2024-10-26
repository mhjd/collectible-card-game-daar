import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface SetsPageProps {
  sets: any[];
}

export const SetsPage: React.FC<SetsPageProps> = ({ sets }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
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
        <ul className={`${styles.setGrid} ${styles.noListStyle}`} ref={gridRef}>
        {sets.map((set, index) => (
          <li 
            key={index} 
            className={styles.setItem}
            style={{ 
              height: maxHeight ? `${maxHeight + 60}px` : 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Link 
              to={`/set/${set.id}`} 
              className={styles.setLink}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%'
              }}
            >
              <h2 className={styles.setName} style={{ marginBottom: '10px' }}>{set.name}</h2>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <img src={set.images.logo} alt={set.name} className={styles.setLogo} />
              </div>
            </Link>
          </li>
        ))}
        </ul>
      </div>
    </div>
  );
};
