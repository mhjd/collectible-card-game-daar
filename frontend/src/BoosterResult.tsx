import React from 'react';
import styles from './styles.module.css';

interface BoosterResultProps {
  cards: string[];
  onClose: () => void;
}

const BoosterResult: React.FC<BoosterResultProps> = ({ cards, onClose }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Your Booster Cards</h2>
        <div className={styles.cardsGrid}>
          {cards.map((cardId, index) => (
            <div key={index} className={styles.card}>
              {cardId}
            </div>
          ))}
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default BoosterResult;
