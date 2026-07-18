import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PlaceIcon from '@mui/icons-material/Place'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Navbar from '../components/Navbar'
import EditDishModal from '../components/EditDishModal'
import { useAuth } from '../context/AuthContext'
import '../styles/profile.css'

const allergens = ['Gluten', 'Dairy', 'Eggs', 'Peanuts', 'Tree nuts', 'Soy', 'Sesame', 'Fish', 'Shellfish']

function Profile() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [dishes, setDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingAllergens, setEditingAllergens] = useState(false)
  const [selectedAllergens, setSelectedAllergens] = useState(user?.allergens || [])
  const [allergenError, setAllergenError] = useState('')
  const [allergenSuccess, setAllergenSuccess] = useState(false)
  const [editingDish, setEditingDish] = useState(null)

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/dishes?userId=${user._id}`,
          { credentials: 'include' }
        )
        const data = await response.json()
        if (response.ok) {
          setDishes(data)
        }
      } catch {
        console.error('Failed to fetch dishes')
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchDishes()
    }
  }, [user])

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
      setEditingAllergens(false)
      setAllergenSuccess(true)
      setTimeout(() => setAllergenSuccess(false), 3000)
    } catch {
      setAllergenError('Something went wrong. Please try again.')
    }
  }

  const handleDeleteDish = async (dishId) => {
    const confirmed = window.confirm('Are you sure you want to delete this dish?')
    if (!confirmed) return

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/dishes/${dishId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )
      if (response.ok) {
        setDishes((prev) => prev.filter((d) => d._id !== dishId))
      }
    } catch {
      console.error('Failed to delete dish')
    }
  }

  const handleEditDishSuccess = (updatedDish) => {
    setDishes((prev) =>
      prev.map((d) =>
        d._id === updatedDish._id ? { ...d, ...updatedDish } : d
      )
    )
    setEditingDish(null)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-CA')
  }

  const getInitials = () => {
    if (!user) return ''
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
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

  return (
    <div className='profile-page'>
      <Navbar />
      <div className='profile-layout'>

        <aside className='profile-sidebar'>
          <button className='profile-back' onClick={() => navigate('/map')}>
            <ArrowBackIcon fontSize='small' />
            Back to map
          </button>

          <div className='profile-avatar'>{getInitials()}</div>
          <p className='profile-name'>{user?.firstName} {user?.lastName}</p>
          <p className='profile-email'>{user?.email}</p>

          <div className='profile-divider' />

          <div className='profile-section-header'>
            <p className='profile-section-label'>My Allergens</p>
            {!editingAllergens && (
              <button
                className='profile-edit-btn'
                onClick={() => setEditingAllergens(true)}
              >
                <EditIcon style={{ fontSize: '14px' }} />
                Edit
              </button>
            )}
          </div>

          {allergenError && <p className='profile-error'>{allergenError}</p>}
          {allergenSuccess && <p className='profile-success'>Allergens updated</p>}

          {editingAllergens ? (
            <>
              <div className='profile-allergen-chips'>
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
              <div className='profile-allergen-actions'>
                <button
                  className='profile-cancel-btn'
                  onClick={() => {
                    setEditingAllergens(false)
                    setSelectedAllergens(user?.allergens || [])
                    setAllergenError('')
                  }}
                >
                  Cancel
                </button>
                <button
                  className='btn-primary profile-save-btn'
                  onClick={handleSaveAllergens}
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <div className='profile-allergen-chips'>
              {user?.allergens?.length > 0 ? (
                user.allergens.map((allergen) => (
                  <span key={allergen} className='chip chip-active'>
                    {allergen}
                  </span>
                ))
              ) : (
                <p className='profile-empty-small'>No allergens added</p>
              )}
            </div>
          )}

          <div className='profile-divider' />

          <p className='profile-section-label'>Saved Restaurants</p>
          {user?.favourites?.length > 0 ? (
            <ul className='profile-saved-list'>
              {user.favourites.map((fav) => (
                <li
                  key={fav._id}
                  className='profile-saved-item'
                  onClick={() => navigate(`/restaurant/${fav._id}`)}
                >
                  <PlaceIcon style={{ fontSize: '16px', color: 'var(--neutral-500)' }} />
                  <span>{fav.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className='profile-empty-small'>No saved restaurants yet</p>
          )}
        </aside>

        <main className='profile-main'>
          <div className='profile-main-header'>
            <h2 className='profile-main-title'>My Dishes</h2>
            <p className='profile-main-count'>
              {dishes.length} {dishes.length === 1 ? 'dish' : 'dishes'} logged
            </p>
          </div>

          <div className='profile-divider-horizontal' />

          {loading ? (
            <p className='profile-empty'>Loading your dishes...</p>
          ) : dishes.length === 0 ? (
            <p className='profile-empty'>You haven't logged any dishes yet. Find a restaurant on the map and log your first dish!</p>
          ) : (
            <div className='profile-dishes'>
              {dishes.map((dish) => (
                <div key={dish._id} className='dish-card'>
                  <div className='dish-card-header'>
                    <h3 className='dish-name'>{dish.dishName}</h3>
                    <div className='dish-card-actions'>
                      <button
                        className='dish-action-btn'
                        onClick={() => setEditingDish(dish)}
                      >
                        <EditIcon style={{ fontSize: '16px' }} />
                      </button>
                      <button
                        className='dish-action-btn dish-action-delete'
                        onClick={() => handleDeleteDish(dish._id)}
                      >
                        <DeleteIcon style={{ fontSize: '16px' }} />
                      </button>
                    </div>
                  </div>
                  <div className='dish-restaurant'>
                    <PlaceIcon style={{ fontSize: '14px', color: 'var(--neutral-500)' }} />
                    <span
                      className='dish-restaurant-name'
                      onClick={() => navigate(`/restaurant/${dish.restaurantId}`)}
                    >
                      {dish.restaurantName}
                    </span>
                  </div>
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
                    {formatDate(dish.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>

      </div>

      {editingDish && (
        <EditDishModal
          dish={editingDish}
          onClose={() => setEditingDish(null)}
          onSuccess={handleEditDishSuccess}
        />
      )}
    </div>
  )
}

export default Profile