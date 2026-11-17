import { useEffect, useState } from 'react'
import { apiRequest } from './api'

function App() {
  const [listings, setListings] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    apiRequest('/api/listings')
      .then(setListings)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-4xl font-bold text-emerald-700">Yatra</h1>
      {error && <p className="mt-4 text-red-600">{error}</p>}
      <p className="mt-4 text-slate-600">{listings.length} listings loaded</p>
      <ul className="mt-2 list-disc pl-6">
        {listings.map((listing) => (
          <li key={listing.id}>{listing.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default App