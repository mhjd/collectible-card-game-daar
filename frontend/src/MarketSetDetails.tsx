import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { buyCard } from './blockchain'
import styles from './styles.module.css'
import pokemon from 'pokemontcgsdk'

const MarketSetDetails = () => {
  const { setId } = useParams<{ setId: string }>()
  const [cards, setCards] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  useEffect(() => {
    if (setId) {
      pokemon.card.where({ q: `set.id:${setId}` })
        .then(result => setCards(result.data))
        .catch(error => console.error('Error fetching Pokémon cards:', error))
    }
  }, [setId])

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCardClick = (cardId: string, setId: string) => {
    console.log('Card clicked:', cardId); 
    console.log('Of set :', setId); 
    setSelectedCard(cardId);
    setShowConfirm(true);
  };

  const handlePayment = async () => {
    if (selectedCard && setId) {
      const success = await buyCard(setId, selectedCard);
      if (success) {
        console.log('Card purchased successfully!');
      } else {
        console.error('Failed to purchase card');
      }
    }
    setShowConfirm(false);
  };

  return (
    <div className={styles.body}>
      <h1>Cards Available in Set: {setId}</h1>
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search cards by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.cardGrid}>
        {cards.length > 0 ? (
          filteredCards.map(card => (
            <div 
              key={card.id} 
              className={styles.cardItem}
              onClick={() => handleCardClick(card.id, setId)}
              style={{ cursor: 'pointer' }}
            >
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

      {showConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>Confirm Purchase</h2>
              <p>Do you want to buy this card?</p>
              <div className={styles.modalButtons}>
                <button onClick={handlePayment}>Yes</button>
                <button onClick={() => setShowConfirm(false)}>No</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MarketSetDetails
