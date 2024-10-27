import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';
import logo from './pictures/TCG_logo.png';
import steven from './pictures/steven_metagross.png'
import lucario from './pictures/mega_lucario.png'

export const HomePage: React.FC = () => {
  return (
    <div className={styles.body}>
      <div className={styles.containerHomePage}>
        <img src={steven} alt={"Steven and Metagross"} className={styles.steven} />
        <div className={styles.logoContainer}> {/* Added container for logo */}
          <img src={logo} alt="Pokémon TCG Logo" className={styles.logo} />
        <nav className={styles.navigation}>
          <ul className={styles.noListStyleHomePage}>
            <li>
              <Link to="/sets">
                <button className={styles.navLink} role="button"><span className={styles.text}>Extensions</span>
                </button>
              </Link>
            </li>
            <li>
              <Link to="/collection">
                <button className={styles.navLink} role="button"><span className={styles.text}>Ma Collection</span>
                </button>
              </Link>
            </li>
            <li>
              <Link to="/open-booster">
                <button className={styles.navLink} role="button"><span className={styles.text}>Boosters</span></button>
              </Link>
            </li>
            <li>
              <Link to="/marketplace">
                <button className={styles.navLink} role="button"><span className={styles.text}>Market Place</span></button>
              </Link>
            </li>
            <li>
              <Link to="/users">
                <button className={styles.navLink} role="button"><span className={styles.text}>Utilisateurs</span></button>
              </Link>
            </li>
          </ul>
        </nav>
        </div>
        <img src={lucario} alt={'Mega Lucario'} className={styles.lucario} />
      </div>
    </div>
  );
};
