import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import pokemon from 'pokemontcgsdk';
import styles from './styles.module.css';
import { getUserCardsByAddress } from './blockchain';

const UserCollectionPage = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { address } = useParams();

  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        if (!address) return;
        const cardIds = await getUserCardsByAddress(address);
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
  }, [address]);

  return (
    <div className={styles.body}>
      <h1>Collection de {address}</h1>
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
          <p>Aucune carte dans la collection</p>
        )}
      </div>
    </div>
  );
};

export default UserCollectionPage;
