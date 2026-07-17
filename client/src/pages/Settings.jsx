import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PersonIcon from '@mui/icons-material/Person'
import EditIcon from '@mui/icons-material/Edit'
import PlaceIcon from '@mui/icons-material/Place'
import DeleteIcon from '@mui/icons-material/Delete'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import '../styles/settings.css'

const allergens = ['Gluten', 'Dairy', 'Eggs', 'Peanuts', 'Tree nuts', 'Soy', 'Sesame', 'Fish', 'Shellfish']

function Settings() {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()

  const [activeSection, setActiveSection] = useState('account')

  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [accountError, setAccountError] = useState('')
  const [accountSuccess, setAccountSuccess] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  const [selectedAllergens, setSelectedAllergens] = useState(user?.allergens || [])
  const [allergenError, setAllergenError] = useState('')
  const [allergenSuccess, setAllergenSuccess] = useState(false)

  const [location, setLocation] = useState(user?.defaultLocation?.city || '')
  const [locationSuggestions, setLocationSuggestions] = useState([])
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [locationSuccess, setLocationSuccess] = useState(false)
  const locationTimer = useRef(null)

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  const handleSaveAccount = async () => {
    setAccountError('')
    setAccountSuccess(false)

    if (!firstName.trim()) {
      setAccountError('First name is required')
      return
    }

    if (!lastName.trim()) {
      setAccountError('Last name is required')
      return
    }

    if (!email.trim()) {
      setAccountError('Email is required')
      return
    }

    if (!isValidEmail(email)) {
      setAccountError('Please enter a valid email address')
      return
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${user._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ firstName, lastName, email }),
        }
      )
      const data = await response.json()

      if (!response.ok) {
        setAccountError(data.message)
        return
      }

      login({ ...user, firstName, lastName, email })
      setAccountSuccess(true)
      setTimeout(() => setAccountSuccess(false), 3000)
    } catch {
      setAccountError('Something went wrong. Please try again.')
    }
  }

  const handleSavePassword = async () => {
    setPasswordError('')
    setPasswordSuccess(false)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/password`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
        }
      )
      const data = await response.json()

      if (!response.ok) {
        setPasswordError(data.message)
        return
      }

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSuccess(true)
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch {
      setPasswordError('Something went wrong. Please try again.')
    }
  }

  const toggleAllergen = (allergen) => {
    setSelectedAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen]
    )
  }

  const handleSaveAllergens = async () => {
    setAllergenError('')
    setAllergenSuccess(false)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${user._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ allergens: selectedAllergens }),
        }
      )
      const data = await response.json()

      if (!response.ok) {
        setAllergenError(data.message)
        return
      }

      login({ ...user, allergens: selectedAllergens })
      setAllergenSuccess(true)
      setTimeout(() => setAllergenSuccess(false), 3000)
    } catch {
      setAllergenError('Something went wrong. Please try again.')
    }
  }

  const fetchLocationSuggestions = async (input) => {
    if (!input.trim()) {
      setLocationSuggestions([])
      return
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/geocode/autocomplete?input=${encodeURIComponent(input)}`,
        { credentials: 'include' }
      )
      const data = await response.json()
      if (response.ok) {
        setLocationSuggestions(data.suggestions)
        setShowLocationSuggestions(true)
      }
    } catch {
      setLocationSuggestions([])
    }
  }

  const handleLocationInput = (e) => {
    const value = e.target.value
    setLocation(value)
    clearTimeout(locationTimer.current)
    locationTimer.current = setTimeout(() => {
      fetchLocationSuggestions(value)
    }, 300)
  }

  const handleLocationSuggestionClick = (suggestion) => {
    setLocation(suggestion.description)
    setLocationSuggestions([])
    setShowLocationSuggestions(false)
  }

  const handleSaveLocation = async () => {
    setLocationError('')
    setLocationSuccess(false)

    if (!location.trim()) {
      setLocationError('Please enter a city')
      return
    }

    try {
      // The schema stores coordinates, not a city name, so geocode the city
      // first. The lat/lng is what the rest of the app (like restaurant
      // search biasing) actually uses.
      const geocodeResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/geocode?address=${encodeURIComponent(location.trim())}`,
        { credentials: 'include' }
      )
      const geocodeData = await geocodeResponse.json()

      if (!geocodeResponse.ok) {
        setLocationError(geocodeData.message || 'City not found')
        return
      }

      const newDefaultLocation = {
        city: location.trim(),
        lat: geocodeData.lat,
        lng: geocodeData.lng,
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${user._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ defaultLocation: newDefaultLocation }),
        }
      )
      const data = await response.json()

      if (!response.ok) {
        setLocationError(data.message)
        return
      }

      login({ ...user, defaultLocation: newDefaultLocation })
      setLocationSuccess(true)
      setTimeout(() => setLocationSuccess(false), 3000)
    } catch {
      setLocationError('Something went wrong. Please try again.')
    }
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    )
    if (!confirmed) return

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${user._id}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )
      if (response.ok) {
        logout()
        navigate('/')
      }
    } catch {
      console.error('Failed to delete account')
    }
  }

  const navItems = [
    { id: 'account', label: 'Account', icon: <PersonIcon fontSize='small' /> },
    { id: 'allergens', label: 'Allergens', icon: <EditIcon fontSize='small' /> },
    { id: 'location', label: 'Location', icon: <PlaceIcon fontSize='small' /> },
    { id: 'delete', label: 'Delete account', icon: <DeleteIcon fontSize='small' /> },
  ]

  return (
    <div className='settings-page'>
      <Navbar />
      <div className='settings-layout'>

        <aside className='settings-sidebar'>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`settings-nav-item ${activeSection === item.id ? 'settings-nav-item-active' : ''}`}
              onClick={() => {
                setActiveSection(item.id)
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </aside>

        <main className='settings-main'>

          <section id='account' className='settings-section'>
            <h2 className='settings-section-title'>Account</h2>

            <div className='settings-card'>
              <h3 className='settings-card-title'>Account details</h3>
              <p className='settings-card-subtitle'>Update your name and email address</p>

              {accountError && <p className='settings-error'>{accountError}</p>}
              {accountSuccess && <p className='settings-success'>Account updated</p>}

              <div className='settings-name-row'>
                <div className='form-group'>
                  <label className='form-label'>First name</label>
                  <input
                    className='form-input'
                    type='text'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className='form-group'>
                  <label className='form-label'>Last name</label>
                  <input
                    className='form-input'
                    type='text'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className='form-group'>
                <label className='form-label'>Email</label>
                <input
                  className='form-input'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button className='btn-primary settings-save-btn' onClick={handleSaveAccount}>
                Save changes
              </button>
            </div>

            <div className='settings-card'>
              <h3 className='settings-card-title'>Change password</h3>
              <p className='settings-card-subtitle'>Update your current password</p>

              {passwordError && <p className='settings-error'>{passwordError}</p>}
              {passwordSuccess && <p className='settings-success'>Password updated</p>}

              <div className='form-group'>
                <label className='form-label'>Current password</label>
                <input
                  className='form-input'
                  type='password'
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className='form-group'>
                <label className='form-label'>New password</label>
                <input
                  className='form-input'
                  type='password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className='form-group'>
                <label className='form-label'>Confirm new password</label>
                <input
                  className='form-input'
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button className='btn-primary settings-save-btn' onClick={handleSavePassword}>
                Save changes
              </button>
            </div>
          </section>

          <section id='allergens' className='settings-section'>
            <h2 className='settings-section-title'>Allergens</h2>

            <div className='settings-card'>
              <h3 className='settings-card-title'>Your allergens</h3>
              <p className='settings-card-subtitle'>Update the allergens on your profile</p>

              {allergenError && <p className='settings-error'>{allergenError}</p>}
              {allergenSuccess && <p className='settings-success'>Allergens updated</p>}

              <div className='settings-chips'>
                {allergens.map((allergen) => (
                  <button
                    key={allergen}
                    className={`chip ${selectedAllergens.includes(allergen.toLowerCase()) || selectedAllergens.includes(allergen) ? 'chip-active' : 'chip-inactive'}`}
                    onClick={() => toggleAllergen(allergen.toLowerCase())}
                  >
                    {allergen}
                  </button>
                ))}
              </div>

              <button className='btn-primary settings-save-btn' onClick={handleSaveAllergens}>
                Save changes
              </button>
            </div>
          </section>

          <section id='location' className='settings-section'>
            <h2 className='settings-section-title'>Location</h2>

            <div className='settings-card'>
              <h3 className='settings-card-title'>Default location</h3>
              <p className='settings-card-subtitle'>Set your default city so your map always opens somewhere relevant to you</p>

              {locationError && <p className='settings-error'>{locationError}</p>}
              {locationSuccess && <p className='settings-success'>Location updated</p>}

              <div className='form-group settings-location-wrapper'>
                <label className='form-label'>City or area</label>
                <input
                  className='form-input'
                  type='text'
                  placeholder='e.g. Vancouver, BC'
                  value={location}
                  onChange={handleLocationInput}
                  onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 150)}
                />
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <ul className='settings-location-suggestions'>
                    {locationSuggestions.map((suggestion) => (
                      <li
                        key={suggestion.place_id}
                        className='settings-location-suggestion-item'
                        onClick={() => handleLocationSuggestionClick(suggestion)}
                      >
                        {suggestion.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button className='btn-primary settings-save-btn' onClick={handleSaveLocation}>
                Save changes
              </button>
            </div>
          </section>

          <section id='delete' className='settings-section'>
            <h2 className='settings-section-title'>Delete account</h2>

            <div className='settings-card settings-card-danger'>
              <h3 className='settings-card-title'>Delete your account</h3>
              <p className='settings-card-subtitle'>This action cannot be undone. All your data will be permanently deleted.</p>

              <button className='btn-danger settings-save-btn' onClick={handleDeleteAccount}>
                Delete account
              </button>
            </div>
          </section>

        </main>
      </div>
    </div>
  )
}

export default Settings