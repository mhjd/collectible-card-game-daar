import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import logo from './pictures/TCG_logo.png';

export const HomePage: React.FC = () => {
  return (
    <div className={styles.body}>
      <div className={styles.container}>
        <img src={logo} alt="Pokémon TCG Logo" width="60%" />
        <nav className={styles.navigation}>
          <ul className={styles.noListStyle}>
            <li>
              <Link to="/sets">
                <button className={styles.navLink} role="button" ><span className={styles.text}>Extensions</span></button>
              </Link>
            </li>
            <li>
              <Link to="/collection">
                <button className={styles.navLink} role="button"><span className={styles.text}>Ma Collection</span></button>
              </Link>
            </li>
            <li>
              <Link to="/open-booster">
                <button className={styles.navLink} role="button" ><span className={styles.text}>Boosters</span></button>
              </Link>
            </li>
            <li>
              <Link to="/chacal">
                <button className={styles.navLink} role="button" ><span className={styles.text}>Tests</span></button>
              </Link>
            </li>
          </ul>
        </nav>
        {/*<input type="button" className="button-64" role="button"><span className="text">Extensions</span></input>*/}
      </div>
    </div>
  );
};
