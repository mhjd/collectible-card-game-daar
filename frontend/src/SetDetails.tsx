import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from './styles.module.css'
import pokemon from 'pokemontcgsdk'

const SetDetails = () => {
  const { setId } = useParams<{ setId: string }>()
  const [cards, setCards] = useState<any[]>([])

  useEffect(() => {
    if (setId) {
      pokemon.card.where({ q: `set.id:${setId}` })
        .then(result => setCards(result.data))
        .catch(error => console.error('Error fetching Pokémon cards:', error))
    }
  }, [setId])

  return (
    <div className={styles.body}>
      <h1>Cards in Set: {setId}</h1>
      <div className={styles.cardGrid}>
        {cards.length > 0 ? (
          cards.map(card => (
            <div key={card.id} className={styles.cardItem}>
              <h2>{card.name}</h2>
              <img src={card.images.small} alt={card.name} />
            </div>
          ))
        ) : (
          <p>Loading cards...</p>
        )}
      </div>
    </div>
  )
}

export default SetDetails
