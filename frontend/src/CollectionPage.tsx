import React, { useEffect, useState } from 'react';
import pokemon from 'pokemontcgsdk';
import styles from './styles.module.css';
import { getUserCardsOfUser, initBlockchain } from './blockchain';

const CollectionPage = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        await initBlockchain();
        const cardIds = await getUserCardsOfUser();
        if (cardIds) {
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
          setCards(validCards);
        }
      } catch (error) {
        console.error('Error fetching user cards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCards();
  }, []);

  return (
    <div className={styles.body}>
      <h1>Ma Collection</h1>
      <div className={styles.cardGrid}>
        {loading ? (
          <p>Chargement de la collection...</p>
        ) : cards.length > 0 ? (
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
          <p>Aucune carte dans votre collection</p>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
