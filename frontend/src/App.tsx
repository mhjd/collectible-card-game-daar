import { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import styles from './styles.module.css'
import * as ethereum from '@/lib/ethereum'
import * as main from '@/lib/main'
import pokemon from 'pokemontcgsdk'
import SetDetails from './SetDetails'
import { HomePage } from './HomePage'
import { SetsPage } from './SetsPage'
import SearchResults from './SearchResults'
import Chacal from './Chacal'

pokemon.configure({ apiKey: '45682ac3-6104-4885-bcce-9bceba950da5' })

type Canceler = () => void
const useAffect = (
  asyncEffect: () => Promise<Canceler | void>,
  dependencies: any[] = []
) => {
  const cancelerRef = useRef<Canceler | void>()
  useEffect(() => {
    asyncEffect()
      .then(canceler => (cancelerRef.current = canceler))
      .catch(error => console.warn('Uncatched error', error))
    return () => {
      if (cancelerRef.current) {
        cancelerRef.current()
        cancelerRef.current = undefined
      }
    }
  }, dependencies)
}

const useWallet = () => {
  const [details, setDetails] = useState<ethereum.Details>()
  const [contract, setContract] = useState<main.Main>()
  useAffect(async () => {
    const details_ = await ethereum.connect('metamask')
    if (!details_) return
    setDetails(details_)
    const contract_ = await main.init(details_)
    if (!contract_) return
    setContract(contract_)
  }, [])
  return useMemo(() => {
    if (!details || !contract) return
    return { details, contract }
  }, [details, contract])
}

const usePokemonSets = () => {
  const [sets, setSets] = useState<any[]>([])
  useEffect(() => {
    pokemon.set.all()
      .then(result => setSets(result))
      .catch(error => console.error('Error fetching Pokémon sets:', error))
  }, [])
  return sets
}

export const App = () => {
  const wallet = useWallet()
  const sets = usePokemonSets()
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sets" element={<SetsPage sets={sets} />} />
        <Route path="/set/:setId" element={<SetDetails />} />
        <Route path="/search" element={<SearchResults />} />
	<Route path="/chacal" element={<Chacal />} />
      </Routes>
    </Router>
  )
}
