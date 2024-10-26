import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styles from './styles.module.css'
import pokemon from 'pokemontcgsdk'

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    
    pokemon.card.where({ q: `name:"*${query}*"` })
      .then(result => {
        setCards(result.data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error searching Pokémon cards:', error)
        setLoading(false)
      })
  }, [query])

  return (
    <div className={styles.body}>
      <h1>Search Results for: {query}</h1>
      {loading ? (
        <p>Loading results...</p>
      ) : (
        <>
          <p>Found {cards.length} cards</p>
          <div className={styles.cardGrid}>
            {cards.map(card => (
              <div 
                key={card.id} 
                className={styles.cardItem}
                onClick={() => navigate(`/card/${card.id}`)}
              >
                <h2>{card.name}</h2>
                <img src={card.images.small} alt={card.name} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default SearchResults
