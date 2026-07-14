import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/navbar.css'
import { useAuth } from '../context/AuthContext'

function Navbar({ onSearch }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
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

  return (
    <nav className='navbar'>
      <span className='navbar-wordmark' onClick={() => navigate('/map')}>
        Bitew<span className='navbar-wordmark-i'>i</span>se
      </span>

      <div className='navbar-search'>
        <input
          className='navbar-search-input'
          type='text'
          placeholder='Search restaurants...'
          onChange={(e) => {
            if (onSearch) {
              onSearch(e.target.value)
            }
          }}
        />
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
    </nav>
  )
}

export default Navbar