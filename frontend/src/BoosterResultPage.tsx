import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import pokemon from 'pokemontcgsdk';
import styles from './styles.module.css';

const BoosterResultPage = () => {
  const [cards, setCards] = useState<any[]>([]);
  const location = useLocation();
  const cardIds = location.state?.cards || [];

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const validCardIds = cardIds.filter((id: string) => id !== undefined && id !== null);
        const cardDetails = await Promise.all(
          validCardIds.map(async (cardId: string) => {
            try {
              const card = await pokemon.card.find(cardId);
              return card;
            } catch (error) {
              console.error(`Error fetching card ${cardId}:`, error);
              return null;
            }
          })
        );
        const validCards = cardDetails.filter(card => card !== null);
        console.log('Valid cards fetched:', validCards);
        setCards(validCards);
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    if (cardIds.length > 0) {
      fetchCards();
    }
  }, [cardIds]);

  return (
    <div className={styles.body}>
      <h1>Cards Dropped</h1>
      <div className={styles.cardGrid}>
        {cards.length > 0 ? (
          cards.map(card => (
            <div key={card.id} className={styles.cardItem}>
              <h2>{card.name}</h2>
              <img 
                src={card.images.small} 
                alt={card.name} 
                style={{ width: '240px', height: '330px', objectFit: 'contain' }}
              />
            </div>
          ))
        ) : (
          <p>Loading cards...</p>
        )}
      </div>
    </div>
  );
};

export default BoosterResultPage;
