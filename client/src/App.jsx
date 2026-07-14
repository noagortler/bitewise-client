import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Map from './pages/Map'
import Restaurant from './pages/Restaurant'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Navigate to='/' />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/map' element={<ProtectedRoute><Map /></ProtectedRoute>} />
        <Route path='/restaurant/:id' element={<ProtectedRoute><Restaurant /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/settings' element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App