import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

interface SetsPageProps {
  sets: any[];
}

export const SetsPage: React.FC<SetsPageProps> = ({ sets }) => {
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <h1>Pokemon TCG Sets</h1>
        <ul className={`${styles.setGrid} ${styles.noListStyle}`}>
        {sets.map((set, index) => (
          <li key={index} className={styles.setItem}>
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
