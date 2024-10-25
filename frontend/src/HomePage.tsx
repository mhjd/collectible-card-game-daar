import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

interface HomePageProps {
  sets: any[];
}

export const HomePage: React.FC<HomePageProps> = ({ sets }) => {
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <h1>Home Page</h1>
        <ul className={`${styles.setGrid} ${styles.noListStyle}`}>
        {sets.map((set, index) => (
          <li key={index} className={styles.setItem}>
            <Link to={`/set/${set.id}`} className={styles.setLink}>
              <img src={set.images.logo} alt={set.name} className={styles.setLogo} />
            </Link>
          </li>
        ))}
        </ul>
      </div>
    </div>
  );
};