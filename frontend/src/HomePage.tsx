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
              <Link to="/setsa" className={styles.navLink}>Browse All Sets</Link>
            </li>
            <li>
              <Link to="/collection" className={styles.navLink}>My Collection</Link>
            </li>
            <li>
              <Link to="/open-booster" className={styles.navLink}>Open Booster</Link>
            </li>
            <li>
              <Link to="/chacal" className={styles.navLink}>Test Connection with Solidity</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
