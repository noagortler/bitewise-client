import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/auth.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()

  // If the user already has a valid session (e.g. opening the app in a new
  // tab while logged in), skip the login form and go straight to the map
  if (loading) {
    return <div />
  }

  if (user) {
    return <Navigate to='/map' />
  }

  const handleSubmit = async () => {
    setError('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
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
      <div className='auth-left'>
        <p className='auth-wordmark'>
          Bitew<span className='auth-wordmark-i'>i</span>se
        </p>
        <p className='auth-tagline'>
          Find allergy-safe dishes at restaurants near you, shared by your community.
        </p>
      </div>

      <div className='auth-right'>
        <div className='auth-card'>
          <h2 className='auth-card-title'>Welcome back</h2>
          <p className='auth-card-sub'>Log in to your Bitewise account</p>

          {error && <p className='auth-error'>{error}</p>}

          <div className='form-group'>
            <label className='form-label'>Email</label>
            <input
              className='form-input'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='name@email.com'
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

          <button className='btn-primary auth-btn' onClick={handleSubmit}>
            Log in
          </button>

          <p className='auth-footer'>
            Don't have an account?{' '}
            <Link to='/signup' className='auth-link'>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login