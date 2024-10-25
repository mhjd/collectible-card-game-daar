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
