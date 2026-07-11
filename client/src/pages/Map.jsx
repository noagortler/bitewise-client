import { useState, useEffect, useRef } from 'react'
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps'
import Navbar from '../components/Navbar'
import '../styles/map.css'

const allergens = ['Gluten', 'Dairy', 'Eggs', 'Peanuts', 'Tree nuts', 'Soy', 'Sesame', 'Fish', 'Shellfish']

const fallbackCenter = { lat: 49.2827, lng: -123.1207 }

function MapController({ center }) {
  const map = useMap()

  useEffect(() => {
    if (map && center) {
      map.panTo(center)
    }
  }, [map, center])

  return null
}

function Map() {
  const [activeAllergens, setActiveAllergens] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [mapCenter, setMapCenter] = useState(fallbackCenter)
  const [cityLabel, setCityLabel] = useState('Vancouver, BC')
  const [showDropdown, setShowDropdown] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [locationError, setLocationError] = useState('')
  const dropdownRef = useRef(null)
  const autocompleteTimer = useRef(null)

  useEffect(() => {
    fetchRestaurants(mapCenter.lat, mapCenter.lng)
  }, [mapCenter])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
        setShowSearch(false)
        setSearchInput('')
        setSuggestions([])
        setLocationError('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setMapCenter({ lat: latitude, lng: longitude })
          try {
            const response = await fetch(
              `http://localhost:5000/api/geocode/reverse?lat=${latitude}&lng=${longitude}`,
              { credentials: 'include' }
            )
            const data = await response.json()
            if (response.ok) {
              setCityLabel(data.cityLabel)
            } else {
              setCityLabel('My location')
            }
          } catch {
            setCityLabel('My location')
          }
        },
        () => {
          // if they deny permission, keep fallback center
        }
      )
    }
  }, [])

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

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setMapCenter({ lat: latitude, lng: longitude })
        setShowDropdown(false)
        setShowSearch(false)
        setLocationError('')
        try {
          const response = await fetch(
            `http://localhost:5000/api/geocode/reverse?lat=${latitude}&lng=${longitude}`,
            { credentials: 'include' }
          )
          const data = await response.json()
          if (response.ok) {
            setCityLabel(data.cityLabel)
          } else {
            setCityLabel('My location')
          }
        } catch {
          setCityLabel('My location')
        }
      },
      () => {
        setLocationError('Unable to get your location')
      }
    )
  }

  const fetchSuggestions = async (input) => {
    if (!input.trim()) {
      setSuggestions([])
      return
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/geocode/autocomplete?input=${encodeURIComponent(input)}`,
        { credentials: 'include' }
      )
      const data = await response.json()
      if (response.ok) {
        setSuggestions(data.suggestions)
      }
    } catch {
      setSuggestions([])
    }
  }

  const handleSearchInput = (e) => {
    const value = e.target.value
    setSearchInput(value)
    clearTimeout(autocompleteTimer.current)
    autocompleteTimer.current = setTimeout(() => {
      fetchSuggestions(value)
    }, 300)
  }

  const handleSuggestionClick = async (suggestion) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/geocode?address=${encodeURIComponent(suggestion.description)}`,
        { credentials: 'include' }
      )
      const data = await response.json()
      if (response.ok) {
        setMapCenter({ lat: data.lat, lng: data.lng })
        setCityLabel(suggestion.description)
        setShowDropdown(false)
        setShowSearch(false)
        setSearchInput('')
        setSuggestions([])
        setLocationError('')
      }
    } catch {
      setLocationError('Something went wrong. Please try again.')
    }
  }

  const handleCitySearch = async (e) => {
    if (e.key !== 'Enter') return
    if (!searchInput.trim()) return

    try {
      const response = await fetch(
        `http://localhost:5000/api/geocode?address=${encodeURIComponent(searchInput)}`,
        { credentials: 'include' }
      )
      const data = await response.json()

      if (!response.ok) {
        setLocationError('City not found. Please try again.')
        return
      }

      setMapCenter({ lat: data.lat, lng: data.lng })
      setCityLabel(data.formattedAddress)
      setShowDropdown(false)
      setShowSearch(false)
      setSearchInput('')
      setSuggestions([])
      setLocationError('')
    } catch {
      setLocationError('Something went wrong. Please try again.')
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
        <div className='city-btn-wrapper' ref={dropdownRef}>
          <button
            className='city-btn'
            onClick={() => {
              setShowDropdown(!showDropdown)
              setShowSearch(false)
              setSearchInput('')
              setSuggestions([])
              setLocationError('')
            }}
          >
            {cityLabel}
          </button>

          {showDropdown && (
            <div className='city-dropdown'>
              <button
                className='city-dropdown-item'
                onClick={handleUseMyLocation}
              >
                Use my location
              </button>
              <button
                className='city-dropdown-item'
                onClick={() => setShowSearch(true)}
              >
                Search city or area
              </button>
              {showSearch && (
                <>
                  <input
                    className='city-search-input'
                    type='text'
                    placeholder='e.g. Toronto, ON'
                    value={searchInput}
                    onChange={handleSearchInput}
                    onKeyDown={handleCitySearch}
                    autoFocus
                  />
                  {suggestions.length > 0 && (
                    <ul className='city-suggestions'>
                      {suggestions.map((suggestion) => (
                        <li
                          key={suggestion.place_id}
                          className='city-suggestion-item'
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}
              {locationError && (
                <p className='city-error'>{locationError}</p>
              )}
            </div>
          )}
        </div>

        <div className='toolbar-chips'>
          {allergens.map((allergen) => (
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
            defaultCenter={fallbackCenter}
            defaultZoom={13}
            gestureHandling='greedy'
            disableDefaultUI={true}
            mapId='c686d0ed91a5bdc32e290a5b'
          >
            <MapController center={mapCenter} />
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