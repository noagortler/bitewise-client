import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PlaceIcon from '@mui/icons-material/Place'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import '../styles/navbar.css'
import { useAuth } from '../context/AuthContext'
import LogDishModal from './LogDishModal'

function Navbar({ onSearch }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [selectedGoogleRestaurant, setSelectedGoogleRestaurant] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const searchRef = useRef(null)
  const searchQueryRef = useRef('')

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null)
      setShowSearchDropdown(false)
      return
    }

    // Hide the dropdown immediately so stale results from a previous
    // search don't flash while the new debounced fetch is still pending
    setShowSearchDropdown(false)

    const queryAtRequestTime = searchQuery.trim()

    const timer = setTimeout(async () => {
      try {
        // Bias results to wherever the user currently is on the map, so
        // searching while browsing Vancouver returns Vancouver results even
        // if their saved default is elsewhere. Falls back to their saved
        // default location if they haven't moved the map this session.
        let biasParams = ''
        try {
          const savedMap = JSON.parse(sessionStorage.getItem('bitewise-map-position'))
          if (savedMap?.lat) {
            biasParams = `&lat=${savedMap.lat}&lng=${savedMap.lng}`
          }
        } catch {
          biasParams = ''
        }
        if (!biasParams && user?.defaultLocation?.lat) {
          biasParams = `&lat=${user.defaultLocation.lat}&lng=${user.defaultLocation.lng}`
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/restaurants/search?query=${encodeURIComponent(queryAtRequestTime)}${biasParams}`,
          { credentials: 'include' }
        )
        const data = await response.json()

        // Guard against race conditions: if the input has changed since this
        // request was fired, an earlier request's response could resolve after
        // a later one and overwrite fresh results with stale ones. Only apply
        // this response if it still matches what's currently typed.
        if (searchQueryRef.current !== queryAtRequestTime) return

        if (response.ok) {
          setSearchResults({ ...data, query: queryAtRequestTime })
          setShowSearchDropdown(true)
        }
      } catch {
        console.error('Search failed')
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSearchChange = (e) => {
    const value = e.target.value
    searchQueryRef.current = value.trim()
    setSearchQuery(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleClearSearch = () => {
    searchQueryRef.current = ''
    setSearchQuery('')
    setSearchResults(null)
    setShowSearchDropdown(false)
    if (onSearch) {
      onSearch('')
    }
  }

  const handleSelectBitewiseRestaurant = (restaurant) => {
    searchQueryRef.current = ''
    setShowSearchDropdown(false)
    setSearchQuery('')
    navigate(`/restaurant/${restaurant._id}`)
  }

  const handleSelectGoogleRestaurant = async (restaurant) => {
    if (loadingDetails) return
    setLoadingDetails(true)
    setShowSearchDropdown(false)

    // Autocomplete results only include a name and place ID. Fetch the full
    // details (address, phone, coordinates) before opening the modal, since
    // logging a dish needs them to create the restaurant.
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/restaurants/place-details/${restaurant.googlePlaceId}`,
        { credentials: 'include' }
      )
      const data = await response.json()
      if (response.ok) {
        setSelectedGoogleRestaurant(data)
      }
    } catch {
      console.error('Failed to fetch place details')
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleLogDishSuccess = (data) => {
    setSelectedGoogleRestaurant(null)
    searchQueryRef.current = ''
    setSearchQuery('')
    navigate(`/restaurant/${data.restaurantId}`)
  }

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      console.error('Logout failed')
    } finally {
      logout()
      navigate('/')
    }
  }

  const getInitials = () => {
    if (!user) return ''
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
  }

  const hasResults = searchResults && (searchResults.onBitewise.length > 0 || searchResults.fromGoogle.length > 0)

  return (
    <nav className='navbar'>
      <span className='navbar-wordmark' onClick={() => navigate('/map')}>
        Bitew<span className='navbar-wordmark-i'>i</span>se
      </span>

      <div className='navbar-search' ref={searchRef}>
        <input
          className='navbar-search-input'
          type='text'
          placeholder='Search restaurants...'
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => {
            if (searchQuery.trim() && searchResults?.query === searchQuery.trim()) {
              setShowSearchDropdown(true)
            }
          }}
        />

        {searchQuery && (
          <button
            className='navbar-search-clear'
            onClick={handleClearSearch}
            aria-label='Clear search'
          >
            <CloseIcon style={{ fontSize: '14px' }} />
          </button>
        )}

        {showSearchDropdown && (
          <div className='navbar-search-dropdown'>
            {!hasResults ? (
              <p className='navbar-search-empty'>No results found</p>
            ) : (
              <>
                {searchResults.onBitewise.length > 0 && (
                  <div className='navbar-search-group'>
                    <p className='navbar-search-group-label'>On Bitewise</p>
                    {searchResults.onBitewise.map((restaurant) => (
                      <button
                        key={restaurant._id}
                        className='navbar-search-item'
                        onClick={() => handleSelectBitewiseRestaurant(restaurant)}
                      >
                        <PlaceIcon style={{ fontSize: '16px', color: 'var(--neutral-400)' }} />
                        <span className='navbar-search-item-text'>
                          <span className='navbar-search-item-name'>{restaurant.name}</span>
                          <span className='navbar-search-item-address'>{restaurant.address}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {searchResults.fromGoogle.length > 0 && (
                  <div className='navbar-search-group'>
                    <p className='navbar-search-group-label'>Add to Bitewise</p>
                    {searchResults.fromGoogle.map((restaurant) => (
                      <button
                        key={restaurant.googlePlaceId}
                        className='navbar-search-item'
                        onClick={() => handleSelectGoogleRestaurant(restaurant)}
                      >
                        <AddIcon style={{ fontSize: '16px', color: 'var(--verdigris-500)' }} />
                        <span className='navbar-search-item-text'>
                          <span className='navbar-search-item-name'>{restaurant.name}</span>
                          <span className='navbar-search-item-address'>{restaurant.address}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className='navbar-avatar-wrapper' ref={dropdownRef}>
        <button
          className='navbar-avatar'
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {getInitials()}
        </button>

        {showDropdown && (
          <div className='navbar-dropdown'>
            <button
              className='navbar-dropdown-item'
              onClick={() => {
                setShowDropdown(false)
                navigate('/profile')
              }}
            >
              Profile
            </button>
            <button
              className='navbar-dropdown-item'
              onClick={() => {
                setShowDropdown(false)
                navigate('/settings')
              }}
            >
              Settings
            </button>
            <div className='navbar-dropdown-divider' />
            <button
              className='navbar-dropdown-item navbar-dropdown-logout'
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
        )}
      </div>

      {selectedGoogleRestaurant && (
        <LogDishModal
          restaurant={selectedGoogleRestaurant}
          onClose={() => setSelectedGoogleRestaurant(null)}
          onSuccess={handleLogDishSuccess}
        />
      )}
    </nav>
  )
}

export default Navbar