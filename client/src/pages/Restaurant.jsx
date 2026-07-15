import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PlaceIcon from '@mui/icons-material/Place'
import PhoneIcon from '@mui/icons-material/Phone'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import FavoriteIcon from '@mui/icons-material/Favorite'
import AddIcon from '@mui/icons-material/Add'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Navbar from '../components/Navbar'
import LogDishModal from '../components/LogDishModal'
import '../styles/restaurant.css'

const allergens = ['Gluten', 'Dairy', 'Eggs', 'Peanuts', 'Tree nuts', 'Soy', 'Sesame', 'Fish', 'Shellfish']

function Restaurant() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [restaurant, setRestaurant] = useState(null)
  const [dishes, setDishes] = useState([])
  const [activeAllergens, setActiveAllergens] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const fetchDishes = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/dishes?restaurantId=${id}`,
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
          `http://localhost:5000/api/restaurants/${id}`,
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

  const toggleAllergen = (allergen) => {
    setActiveAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen]
    )
  }

  const filteredDishes = dishes.filter((dish) => {
    if (activeAllergens.length === 0) return true
    return activeAllergens.every((a) =>
      dish.freeFrom.includes(a.toLowerCase())
    )
  })

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

  if (loading) {
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

            <button className='btn-secondary restaurant-save-btn'>
              <FavoriteIcon fontSize='small' />
              Save restaurant
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
            {filteredDishes.length === 0 ? (
              <p className='restaurant-empty'>No dishes logged yet.</p>
            ) : (
              filteredDishes.map((dish) => (
                <div key={dish._id} className='dish-card'>
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