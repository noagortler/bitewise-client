import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PlaceIcon from '@mui/icons-material/Place'
import PhoneIcon from '@mui/icons-material/Phone'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import AddIcon from '@mui/icons-material/Add'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Navbar from '../components/Navbar'
import LogDishModal from '../components/LogDishModal'
import { useAuth } from '../context/AuthContext'
import '../styles/restaurant.css'

const allergens = ['Gluten', 'Dairy', 'Eggs', 'Peanuts', 'Tree nuts', 'Soy', 'Sesame', 'Fish', 'Shellfish']

function Restaurant() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [restaurant, setRestaurant] = useState(null)
  const [dishes, setDishes] = useState([])
  // Start with the user's saved profile allergens pre-selected, mapped back
  // to the capitalized chip labels (allergens are stored lowercase). They
  // can still be toggled off - this is a default, not a lock.
  const [activeAllergens, setActiveAllergens] = useState(() =>
    allergens.filter((a) => user?.allergens?.includes(a.toLowerCase()))
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)

  // Favourites can be populated objects or plain ids depending on where the
  // user object came from, so check both shapes
  const isSaved = user?.favourites?.some(
    (fav) => (fav._id || fav).toString() === id
  )

  const fetchDishes = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/dishes?restaurantId=${id}`,
        { credentials: 'include' }
      )
      const data = await response.json()
      if (response.ok) {
        setDishes(data)
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/restaurants/${id}`,
          { credentials: 'include' }
        )
        const data = await response.json()
        if (response.ok) {
          setRestaurant(data)
        } else {
          setError('Restaurant not found')
        }
      } catch {
        setError('Something went wrong')
      }
    }

    fetchRestaurant()
    fetchDishes()
  }, [id, fetchDishes])

  const handleToggleSave = async () => {
    if (saving || !user) return
    setSaving(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${user._id}/favourites/${id}`,
        {
          method: isSaved ? 'DELETE' : 'POST',
          credentials: 'include',
        }
      )
      const data = await response.json()

      if (response.ok) {
        login({ ...user, favourites: data.favourites })
      }
    } catch {
      console.error('Failed to update saved restaurants')
    } finally {
      setSaving(false)
    }
  }

  const toggleAllergen = (allergen) => {
    setActiveAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen]
    )
  }

  // Dishes are never hidden by the filter - matching dishes sort to the
  // top and get a highlight outline instead
  const matchesFilters = (dish) => {
    if (activeAllergens.length === 0) return false
    return activeAllergens.every((a) =>
      dish.freeFrom.includes(a.toLowerCase())
    )
  }

  const sortedDishes = [...dishes].sort(
    (a, b) => Number(matchesFilters(b)) - Number(matchesFilters(a))
  )

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-CA')
  }

const getModificationsText = (dish) => {
  const mods = []
  if (dish.modifications?.length > 0) {
    mods.push(...dish.modifications)
  }
  if (dish.otherModifications) {
    mods.push(dish.otherModifications)
  }
  return mods.length > 0
    ? mods.map((m) => m.charAt(0).toUpperCase() + m.slice(1)).join(', ')
    : 'none'
}

  const handleAddressClick = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`,
      '_blank'
    )
  }

  // Wait for both the dishes and the restaurant itself, so a slow
  // restaurant fetch can't crash the render
  if (loading || (!restaurant && !error)) {
    return (
      <div className='restaurant-page'>
        <Navbar />
        <div className='restaurant-loading'>Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='restaurant-page'>
        <Navbar />
        <div className='restaurant-loading'>{error}</div>
      </div>
    )
  }

  return (
    <div className='restaurant-page'>
      <Navbar />
      <div className='restaurant-layout'>

        <aside className='restaurant-sidebar'>
          <button className='restaurant-back' onClick={() => navigate('/map')}>
            <ArrowBackIcon fontSize='small' />
            Back to map
          </button>

          <h1 className='restaurant-name'>{restaurant.name}</h1>

          <button className='restaurant-address' onClick={handleAddressClick}>
            <PlaceIcon fontSize='small' className='restaurant-icon' />
            <span>{restaurant.address}</span>
          </button>

          {restaurant.phone && (
            <div className='restaurant-detail'>
              <PhoneIcon fontSize='small' className='restaurant-icon' />
              <span>{restaurant.phone}</span>
            </div>
          )}

          {restaurant.website && (
            <p
              className='restaurant-website'
              onClick={() => window.open(restaurant.website, '_blank')}
            >
              Visit website
            </p>
          )}

          <div className='restaurant-sidebar-divider' />

          <div className='restaurant-mobile-buttons'>
            <button
              className='btn-primary restaurant-log-btn'
              onClick={() => setShowModal(true)}
            >
              <AddIcon fontSize='small' />
              Log a dish
            </button>

            <button
              className='btn-secondary restaurant-save-btn'
              onClick={handleToggleSave}
              disabled={saving}
            >
              {isSaved ? (
                <FavoriteIcon fontSize='small' style={{ color: 'var(--cherry-400)' }} />
              ) : (
                <FavoriteBorderIcon fontSize='small' />
              )}
              {isSaved ? 'Saved' : 'Save restaurant'}
            </button>
          </div>
        </aside>

        <main className='restaurant-main'>
          <div className='restaurant-chips'>
            <span className='restaurant-filter-label'>Filter by allergen:</span>
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

          <div className='restaurant-mobile-filter'>
            <button
              className='restaurant-filter-toggle'
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <span>
                Filter by allergen
                {activeAllergens.length > 0 && ` (${activeAllergens.length})`}
              </span>
              {showFilterDropdown
                ? <KeyboardArrowUpIcon fontSize='small' />
                : <KeyboardArrowDownIcon fontSize='small' />
              }
            </button>

            {showFilterDropdown && (
              <div className='restaurant-filter-dropdown'>
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
            )}
          </div>

          <div className='restaurant-dishes'>
            {sortedDishes.length === 0 ? (
              <p className='restaurant-empty'>No dishes logged yet.</p>
            ) : (
              sortedDishes.map((dish) => (
                <div
                  key={dish._id}
                  className={`dish-card ${matchesFilters(dish) ? 'dish-card-match' : ''}`}
                >
                  <h3 className='dish-name'>{dish.dishName}</h3>
                  <p className='dish-log-count'>
                    {dish.logCount} {dish.logCount === 1 ? 'person' : 'people'} logged this dish
                  </p>
                  <div className='dish-tags'>
                    {dish.freeFrom.map((allergen) => (
                      <span key={allergen} className='tag'>
                        {allergen} free
                      </span>
                    ))}
                  </div>
                  <p className='dish-modifications'>
                    Modifications: {getModificationsText(dish)}
                  </p>
                  <p className='dish-last-logged'>
                    Last logged by: {dish.lastLoggedBy} on: {formatDate(dish.lastLoggedAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </main>

      </div>

      {showModal && (
        <LogDishModal
          restaurant={restaurant}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            fetchDishes()
          }}
        />
      )}

    </div>
  )
}

export default Restaurant