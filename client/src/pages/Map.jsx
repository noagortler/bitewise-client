import { useState, useEffect, useRef } from 'react'
import { APIProvider, Map as GoogleMap, AdvancedMarker, useMap } from '@vis.gl/react-google-maps'
import { useNavigate } from 'react-router-dom'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import Navbar from '../components/Navbar'
import '../styles/map.css'

const allergens = ['Gluten', 'Dairy', 'Eggs', 'Peanuts', 'Tree nuts', 'Soy', 'Sesame', 'Fish', 'Shellfish']

const fallbackCenter = { lat: 49.2827, lng: -123.1207 }

/* Read the last saved map position for this browser session, if any.
   sessionStorage clears when the tab closes, so a fresh visit always
   starts at the user's location instead of wherever they last panned. */
const getSavedMapPosition = () => {
  try {
    const saved = sessionStorage.getItem('bitewise-map-position')
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

/* Custom pin using MUI LocationOnIcon for a fully clickable hit area */
function CustomPin({ color }) {
  return (
    <LocationOnIcon
      style={{ color, fontSize: '40px', display: 'block' }}
    />
  )
}

function MapController({ center, onIdle, onMapReady, selectedRestaurant, onBoundsChanged }) {
  const map = useMap()

  useEffect(() => {
    if (map && center) {
      map.panTo(center)
    }
  }, [map, center])

  useEffect(() => {
    if (!map) return
    onMapReady(map)
    const idleListener = map.addListener('idle', () => {
      const c = map.getCenter()
      onIdle({ lat: c.lat(), lng: c.lng() })
    })
    const boundsListener = map.addListener('bounds_changed', () => {
      if (selectedRestaurant) {
        onBoundsChanged(map, selectedRestaurant)
      }
    })
    return () => {
      idleListener.remove()
      boundsListener.remove()
    }
  }, [map, onIdle, onMapReady, selectedRestaurant, onBoundsChanged])

  return null
}

function Map() {
  const savedPosition = getSavedMapPosition()

  const [activeAllergens, setActiveAllergens] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [mapCenter, setMapCenter] = useState(
    savedPosition ? { lat: savedPosition.lat, lng: savedPosition.lng } : fallbackCenter
  )
  const [cityLabel, setCityLabel] = useState(savedPosition?.cityLabel || 'Vancouver, BC')
  const [showDropdown, setShowDropdown] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [locationError, setLocationError] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [popupDishes, setPopupDishes] = useState([])
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  const dropdownRef = useRef(null)
  const autocompleteTimer = useRef(null)
  const mapRef = useRef(null)
  const navigate = useNavigate()

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
    // If we restored a saved position, don't let geolocation override it -
    // the user should come back to wherever they last were on the map
    if (getSavedMapPosition()) return

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setMapCenter({ lat: latitude, lng: longitude })
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/api/geocode/reverse?lat=${latitude}&lng=${longitude}`,
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
        () => {}
      )
    }
  }, [])

  useEffect(() => {
    if (!selectedRestaurant) {
      setPopupDishes([])
      return
    }
    const fetchDishes = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/dishes?restaurantId=${selectedRestaurant._id}`,
          { credentials: 'include' }
        )
        const data = await response.json()
        if (response.ok) {
          setPopupDishes(data)
        }
      } catch {
        setPopupDishes([])
      }
    }
    fetchDishes()
  }, [selectedRestaurant])

  /* Convert lat/lng to pixel position for popup placement */
  const calculatePopupPosition = (map, restaurant) => {
    const projection = map.getProjection()
    const bounds = map.getBounds()
    if (!projection || !bounds) return
    const topRight = projection.fromLatLngToPoint(bounds.getNorthEast())
    const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest())
    const scale = Math.pow(2, map.getZoom())
    const worldPoint = projection.fromLatLngToPoint({
      lat: restaurant.location.lat,
      lng: restaurant.location.lng,
    })
    const x = (worldPoint.x - bottomLeft.x) * scale
    const y = (worldPoint.y - topRight.y) * scale
    setPopupPosition({ x, y })
  }

  const fetchRestaurants = async (lat, lng) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/restaurants?lat=${lat}&lng=${lng}&radius=10000`,
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

  const handleMapIdle = (center) => {
    fetchRestaurants(center.lat, center.lng)

    // Save the current position so navigating away (e.g. to a restaurant
    // page) and coming back returns the user to the same spot
    try {
      sessionStorage.setItem(
        'bitewise-map-position',
        JSON.stringify({
          lat: center.lat,
          lng: center.lng,
          zoom: mapRef.current ? mapRef.current.getZoom() : 13,
          cityLabel,
        })
      )
    } catch {
      // Saving the position is a convenience - if storage fails, the map
      // still works, so there is nothing to handle here
    }
  }

  const handleMapReady = (map) => {
    mapRef.current = map
  }

  const handleBoundsChanged = (map, restaurant) => {
    calculatePopupPosition(map, restaurant)
  }

  const handlePinClick = (restaurant) => {
    setSelectedRestaurant(restaurant)
    if (mapRef.current) {
      calculatePopupPosition(mapRef.current, restaurant)
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
            `${import.meta.env.VITE_API_URL}/api/geocode/reverse?lat=${latitude}&lng=${longitude}`,
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
        `${import.meta.env.VITE_API_URL}/api/geocode/autocomplete?input=${encodeURIComponent(input)}`,
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
        `${import.meta.env.VITE_API_URL}/api/geocode?address=${encodeURIComponent(suggestion.description)}`,
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
        `${import.meta.env.VITE_API_URL}/api/geocode?address=${encodeURIComponent(searchInput)}`,
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

const getPopupAllergenTags = () => {
  if (activeAllergens.length === 0) return { matching: [], rest: [] }

  const allAllergens = new Set()
  popupDishes.forEach((dish) => {
    dish.freeFrom.forEach((a) => allAllergens.add(a))
  })

  const allergenList = Array.from(allAllergens)
  const activeLower = activeAllergens.map((f) => f.toLowerCase())
  const matching = allergenList.filter((a) => activeLower.includes(a.toLowerCase()))

  return { matching, rest: [] }
}

  const popupTags = selectedRestaurant ? getPopupAllergenTags() : { matching: [], rest: [] }

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
              <button className='city-dropdown-item' onClick={handleUseMyLocation}>
                Use my location
              </button>
              <button className='city-dropdown-item' onClick={() => setShowSearch(true)}>
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
            defaultCenter={savedPosition ? { lat: savedPosition.lat, lng: savedPosition.lng } : fallbackCenter}
            defaultZoom={savedPosition?.zoom || 13}
            gestureHandling='greedy'
            disableDefaultUI={true}
            mapId='c686d0ed91a5bdc32e290a5b'
            onClick={() => setSelectedRestaurant(null)}
          >
            <MapController
              center={mapCenter}
              onIdle={handleMapIdle}
              onMapReady={handleMapReady}
              selectedRestaurant={selectedRestaurant}
              onBoundsChanged={handleBoundsChanged}
            />

            {restaurants.map((restaurant) => (
              <AdvancedMarker
                key={restaurant._id}
                position={{
                  lat: restaurant.location.lat,
                  lng: restaurant.location.lng,
                }}
                onClick={() => handlePinClick(restaurant)}
              >
                <CustomPin
                  color='#25A691'
                />
              </AdvancedMarker>
            ))}
          </GoogleMap>
        </APIProvider>

        {selectedRestaurant && (
          <div
            className='map-popup'
            style={{
              left: `${popupPosition.x - 110}px`,
              top: `${popupPosition.y - 200}px`,
            }}
          >
            <button className='map-popup-close' onClick={() => setSelectedRestaurant(null)}>x</button>
            <p className='map-popup-name'>{selectedRestaurant.name}</p>
            <p className='map-popup-address'>{selectedRestaurant.address}</p>

            {selectedRestaurant.phone && (
              <p className='map-popup-detail'>{selectedRestaurant.phone}</p>
            )}

            {selectedRestaurant.website && (
              <p
                className='map-popup-website'
                onClick={() => window.open(selectedRestaurant.website, '_blank')}
              >
                {selectedRestaurant.website}
              </p>
            )}

            {(popupTags.matching.length > 0 || popupTags.rest.length > 0) && (
              <div className='map-popup-tags'>
                {popupTags.matching.map((a) => (
                  <span key={a} className='map-popup-tag map-popup-tag-match'>
                    {a} free
                  </span>
                ))}
                {popupTags.rest.map((a) => (
                  <span key={a} className='map-popup-tag map-popup-tag-default'>
                    {a} free
                  </span>
                ))}
              </div>
            )}

            <button
              className='map-popup-btn'
              onClick={() => navigate(`/restaurant/${selectedRestaurant._id}`)}
            >
              More info
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Map