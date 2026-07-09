import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PersonIcon from '@mui/icons-material/Person'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PlaceIcon from '@mui/icons-material/Place'
import '../styles/auth.css'
import '../styles/signup.css'

const ALLERGENS = ['Gluten', 'Dairy', 'Eggs', 'Peanuts', 'Tree nuts', 'Soy', 'Sesame', 'Fish', 'Shellfish']

function Signup() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [allergens, setAllergens] = useState([])
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const toggleAllergen = (allergen) => {
    setAllergens((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen]
    )
  }

  const handleSubmit = async () => {
    setError('')

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          allergens: allergens.map((a) => a.toLowerCase()),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message)
        return
      }

      login(data)
      navigate('/map')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className='auth-page'>
      <div className='signup-left'>
        <p className='auth-wordmark'>
          Bitew<span className='auth-wordmark-i'>i</span>se
        </p>
        <p className='auth-tagline'>
          Join the community and start finding allergy-safe dishes near you.
        </p>
        <div className='signup-steps'>
          <div className='signup-step-card'>
            <div className='signup-step-icon'>
              <PersonIcon fontSize='small' />
            </div>
            <div className='signup-step-content'>
              <p className='signup-step-label'>Step 1</p>
              <p className='signup-step-text'>Create your account with your name and email</p>
            </div>
          </div>
          <div className='signup-step-card'>
            <div className='signup-step-icon'>
              <CheckCircleIcon fontSize='small' />
            </div>
            <div className='signup-step-content'>
              <p className='signup-step-label'>Step 2</p>
              <p className='signup-step-text'>Select your allergens so we can personalize your map</p>
            </div>
          </div>
          <div className='signup-step-card'>
            <div className='signup-step-icon'>
              <PlaceIcon fontSize='small' />
            </div>
            <div className='signup-step-content'>
              <p className='signup-step-label'>Step 3</p>
              <p className='signup-step-text'>Start exploring and logging safe dishes near you</p>
            </div>
          </div>
        </div>
      </div>

      <div className='auth-right'>
        <div className='auth-card'>
          <h2 className='auth-card-title'>Create an account</h2>

          {error && <p className='auth-error'>{error}</p>}

          <div className='signup-name-row'>
            <div className='form-group'>
              <label className='form-label'>First name</label>
              <input
                className='form-input'
                type='text'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder='Felix'
              />
            </div>
            <div className='form-group'>
              <label className='form-label'>Last name</label>
              <input
                className='form-input'
                type='text'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder='Green'
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
              placeholder='felix@email.com'
            />
          </div>

          <div className='form-group'>
            <label className='form-label'>Password</label>
            <input
              className='form-input'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='••••••••'
            />
          </div>

          <div className='form-group'>
            <label className='form-label'>Your allergens</label>
            <p className='signup-allergen-hint'>
              Select all that apply. You can update these anytime in settings.
            </p>
            <div className='signup-chips'>
              {ALLERGENS.map((allergen) => (
                <button
                  key={allergen}
                  className={`chip ${allergens.includes(allergen) ? 'chip-active' : 'chip-inactive'}`}
                  onClick={() => toggleAllergen(allergen)}
                >
                  {allergen}
                </button>
              ))}
            </div>
          </div>

          <button className='btn-primary auth-btn' onClick={handleSubmit}>
            Create account
          </button>

          <p className='auth-footer'>
            Already have an account?{' '}
            <Link to='/' className='auth-link'>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup