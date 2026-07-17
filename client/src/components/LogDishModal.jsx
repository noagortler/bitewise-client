import { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import '../styles/logDishModal.css'

const allergens = ['Gluten', 'Dairy', 'Eggs', 'Peanuts', 'Tree nuts', 'Soy', 'Sesame', 'Fish', 'Shellfish']

const modificationOptions = [
  'No bun', 'No cheese', 'No sauce', 'No dressing', 'No butter',
  'No nuts', 'No mayo', 'No gravy', 'No garnish', 'No croutons',
  'GF substitution', 'DF substitution', 'Other'
]

function LogDishModal({ restaurant, onClose, onSuccess }) {
  const [dishName, setDishName] = useState('')
  const [freeFrom, setFreeFrom] = useState([])
  const [modifications, setModifications] = useState([])
  const [otherModifications, setOtherModifications] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const toggleFreeFrom = (allergen) => {
    setFreeFrom((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen]
    )
  }

  const toggleModification = (mod) => {
    setModifications((prev) =>
      prev.includes(mod)
        ? prev.filter((m) => m !== mod)
        : [...prev, mod]
    )
  }

  const handleSubmit = async () => {
    setError('')

    if (!dishName.trim()) {
      setError('Please enter a dish name')
      return
    }

    if (freeFrom.length === 0) {
      setError('Please select at least one allergen this dish is free from')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          restaurant: {
            googlePlaceId: restaurant.googlePlaceId,
            name: restaurant.name,
            address: restaurant.address,
            phone: restaurant.phone || '',
            website: restaurant.website || '',
            location: {
              lat: restaurant.location.lat,
              lng: restaurant.location.lng,
            },
          },
          dish: {
            dishName: dishName.trim(),
            freeFrom: freeFrom.map((a) => a.toLowerCase()),
            modifications: modifications.filter((m) => m !== 'Other'),
            otherModifications,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message)
        return
      }

      onSuccess(data)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>

        <div className='modal-header'>
          <div>
            <h2 className='modal-title'>Log a Dish</h2>
            <p className='modal-subtitle'>{restaurant.name}</p>
          </div>
          <button className='modal-close' onClick={onClose}>
            <CloseIcon fontSize='small' />
          </button>
        </div>

        <div className='modal-body'>
          {error && <p className='modal-error'>{error}</p>}

          <div className='form-group'>
            <label className='form-label'>Dish name</label>
            <input
              className='form-input'
              type='text'
              placeholder='e.g. Mushroom burger'
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
            />
          </div>

          <div className='form-group'>
            <label className='form-label'>This dish is free from</label>
            <div className='modal-chips'>
              {allergens.map((allergen) => (
                <button
                  key={allergen}
                  className={`chip ${freeFrom.includes(allergen) ? 'chip-active' : 'chip-inactive'}`}
                  onClick={() => toggleFreeFrom(allergen)}
                >
                  {allergen}
                </button>
              ))}
            </div>
          </div>

          <div className='form-group'>
            <label className='form-label'>Modifications</label>
            <p className='modal-hint'>Select all that apply. Use "Other" for anything not listed.</p>
            <div className='modal-chips'>
              {modificationOptions.map((mod) => (
                <button
                  key={mod}
                  className={`chip ${modifications.includes(mod) ? 'chip-active' : 'chip-inactive'}`}
                  onClick={() => toggleModification(mod)}
                >
                  {mod}
                </button>
              ))}
            </div>
          </div>

          {modifications.includes('Other') && (
            <div className='form-group'>
              <label className='form-label'>Other modifications</label>
              <input
                className='form-input'
                type='text'
                placeholder='e.g. no tahini'
                value={otherModifications}
                onChange={(e) => setOtherModifications(e.target.value)}
                autoFocus
              />
            </div>
          )}
        </div>

        <div className='modal-footer'>
          <button className='btn-secondary modal-cancel' onClick={onClose}>
            Cancel
          </button>
          <button
            className='btn-primary modal-submit'
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Logging...' : 'Log dish'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default LogDishModal