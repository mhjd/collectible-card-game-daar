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
        <h1>Home Page</h1>
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
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

export const HomePage: React.FC = () => {
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <h1>Welcome to Pokemon TCG Collection</h1>
        <nav className={styles.navigation}>
          <ul className={styles.noListStyle}>
            <li>
              <Link to="/sets" className={styles.navLink}>Browse All Sets</Link>
            </li>
            {/* Add more navigation links here as needed */}
          </ul>
        </nav>
      </div>
    </div>
  );
};
