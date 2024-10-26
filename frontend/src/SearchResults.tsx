import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import styles from './styles.module.css'
import pokemon from 'pokemontcgsdk'

const POKEMON_TYPES = ['Colorless', 'Darkness', 'Dragon', 'Fairy', 'Fighting', 'Fire', 'Grass', 'Lightning', 'Metal', 'Psychic', 'Water']

const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const typeFilter = selectedTypes.length > 0 ? ` types:${selectedTypes.join('|')}` : ''
    const fullQuery = `${query}${typeFilter}`
    
    pokemon.card.where({ q: fullQuery })
      .then(result => {
        setCards(result.data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error searching Pokémon cards:', error)
        setLoading(false)
      })
  }, [query, selectedTypes])

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  return (
    <div className={styles.body}>
      <h1>Search Results for: {query}</h1>
      <div className={styles.typeFilters}>
        {POKEMON_TYPES.map(type => (
          <button
            key={type}
            onClick={() => handleTypeToggle(type)}
            className={`${styles.typeButton} ${selectedTypes.includes(type) ? styles.selected : ''}`}
          >
            {type}
          </button>
        ))}
      </div>
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
