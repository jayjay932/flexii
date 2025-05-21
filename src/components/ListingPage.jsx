import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CalendarModal from './CalendarModal'

export default function ListingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [availabilityMap, setAvailabilityMap] = useState({})
  const [isCalOpen, setCalOpen] = useState(false)

  // 1. Charger listing + disponibilités
  useEffect(() => {
    fetch(`/api/listing_info.php?id=${id}`)
      .then(r => r.json())
      .then(json => {
        setListing(json.listing)
        setAvailabilityMap(json.availability) // { "2025-05-06":1, ... }
      })
  }, [id])

  // 2. callback du modal
  const handleDatesValidate = (listingId, start, end) => {
    setCalOpen(false)
    navigate(`/checkout?id=${listingId}&start_date=${start}&end_date=${end}`)
  }

  if (!listing) return <p>Chargement…</p>

  return (
    <div>
      <h1>{listing.title}</h1>
      <img src={listing.mainImage} alt="" style={{ width: '100%' }} />

      {/* bouton pour ouvrir le calendrier */}
      <button onClick={() => setCalOpen(true)}>
        Sélectionner mes dates
      </button>

      <CalendarModal
        isOpen={isCalOpen}
        onClose={() => setCalOpen(false)}
        listingId={id}
        availabilityMap={availabilityMap}
        onValidate={handleDatesValidate}
      />
    </div>
  )
}
