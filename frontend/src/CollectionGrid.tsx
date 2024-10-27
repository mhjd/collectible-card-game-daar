import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

interface CollectionGridProps {
  collections: string[];
  onCollectionClick?: (collectionId: string) => void;
  showAsLinks?: boolean;
  linkPrefix?: string;
  additionalInfo?: { [key: string]: any };
  sets?: any[];
}

const CollectionGrid: React.FC<CollectionGridProps> = ({ 
  collections, 
  onCollectionClick,
  showAsLinks = false,
  linkPrefix = "/set/",
  additionalInfo = {},
  sets = []
}) => {
  const gridRef = useRef<HTMLUListElement>(null);

  return (
    <ul 
      className={`${styles.setGrid} ${styles.noListStyle}`} 
      ref={gridRef}
    >
      {collections.map((collectionId, index) => {
        const set = sets?.find(s => s?.id === collectionId) || {
          id: collectionId,
          name: collectionId,
          images: { logo: null }
        };
        const content = (
          <>
            <h2
              className={styles.setName}
              style={{
                marginBottom: '10px',
                color: additionalInfo[collectionId]?.color || 'inherit'
              }}
            >
              {set ? set.name : collectionId}
            </h2>
            {onCollectionClick && <p>Click to open a booster</p>}
            {set && set.images && set.images.logo && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <img 
                  src={set.images.logo} 
                  alt={set.name || collectionId} 
                  className={styles.setLogo} 
                />
              </div>
            )}
          </>
        );

        return (
          <li
            key={index}
            className={styles.setItem}
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={() => !showAsLinks && onCollectionClick && onCollectionClick(collectionId)}
          >
            {showAsLinks ? (
              <Link
                to={`${linkPrefix}${collectionId}`}
                className={styles.setLink}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                {content}
              </Link>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default CollectionGrid;
