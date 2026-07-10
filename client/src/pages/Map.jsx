import { useState, useEffect } from 'react'
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps'
import Navbar from '../components/Navbar'
import '../styles/map.css'

const ALLERGENS = ['Gluten', 'Dairy', 'Eggs', 'Peanuts', 'Tree nuts', 'Soy', 'Sesame', 'Fish', 'Shellfish']

const DEFAULT_CENTER = { lat: 49.2827, lng: -123.1207 }

function Map() {
  const [activeAllergens, setActiveAllergens] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER)

  useEffect(() => {
    fetchRestaurants(mapCenter.lat, mapCenter.lng)
  }, [mapCenter])

  const fetchRestaurants = async (lat, lng) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/restaurants?lat=${lat}&lng=${lng}&radius=10000`,
        { credentials: 'include' }
      )
      const data = await response.json()
      if (response.ok) {
        setRestaurants(data)
      }
    } catch (err) {
      console.error('Failed to fetch restaurants:', err)
    }
  }

  const toggleAllergen = (allergen) => {
    setActiveAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen]
    )
  }

  const matchesFilter = (restaurant) => {
    if (activeAllergens.length === 0) return true
    return restaurant.allergens?.some((a) => activeAllergens.includes(a))
  }

  return (
    <div className='map-page'>
      <Navbar />

      <div className='map-toolbar'>
        <button className='city-btn'>
          Vancouver, BC
        </button>

        <div className='toolbar-chips'>
          {ALLERGENS.map((allergen) => (
            <button
              key={allergen}
              className={`chip ${activeAllergens.includes(allergen) ? 'chip-active' : 'chip-inactive'}`}
              onClick={() => toggleAllergen(allergen)}
            >
              {allergen}
            </button>
          ))}
        </div>
      </div>

      <div className='map-container'>
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            defaultCenter={DEFAULT_CENTER}
            defaultZoom={13}
            gestureHandling='greedy'
            disableDefaultUI={true}
            mapId='c686d0ed91a5bdc32e290a5b'
          >
            {restaurants.map((restaurant) => (
              <AdvancedMarker
                key={restaurant._id}
                position={{
                  lat: restaurant.location.lat,
                  lng: restaurant.location.lng,
                }}
              >
                <Pin
                  background={matchesFilter(restaurant) ? '#25A691' : '#2481A6'}
                  borderColor={matchesFilter(restaurant) ? '#148576' : '#136485'}
                  glyphColor='#ffffff'
                />
              </AdvancedMarker>
            ))}
          </GoogleMap>
        </APIProvider>
      </div>
    </div>
  )
}

export default Map