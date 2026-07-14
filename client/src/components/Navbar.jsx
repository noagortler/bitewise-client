import { useNavigate } from 'react-router-dom'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import '../styles/navbar.css'

function Navbar({ onSearch }) {
  const navigate = useNavigate()

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

      <div className='navbar-icons'>
        <button className='navbar-icon-btn' onClick={() => navigate('/profile')}>
          <PersonIcon fontSize='small' />
        </button>
        <button className='navbar-icon-btn' onClick={() => navigate('/settings')}>
          <SettingsIcon fontSize='small' />
        </button>
      </div>
    </nav>
  )
}

export default Navbar