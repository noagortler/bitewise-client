import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, test, expect, vi } from 'vitest'
import ProtectedRoute from '../components/ProtectedRoute'
import { useAuth } from '../context/AuthContext'

// Mock the auth context so each test controls the login state directly
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}))

const renderProtected = () =>
  render(
    <MemoryRouter initialEntries={['/map']}>
      <Routes>
        <Route path='/' element={<div>Login Page</div>} />
        <Route
          path='/map'
          element={
            <ProtectedRoute>
              <div>Secret Map Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  )

describe('ProtectedRoute', () => {
  test('renders nothing while the auth check is still loading', () => {
    useAuth.mockReturnValue({ user: null, loading: true })

    renderProtected()

    expect(screen.queryByText(/secret map content/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/login page/i)).not.toBeInTheDocument()
  })

  test('redirects to the login page when not logged in', () => {
    useAuth.mockReturnValue({ user: null, loading: false })

    renderProtected()

    expect(screen.getByText(/login page/i)).toBeInTheDocument()
    expect(screen.queryByText(/secret map content/i)).not.toBeInTheDocument()
  })

  test('renders the protected content when logged in', () => {
    useAuth.mockReturnValue({
      user: { _id: 'user-1', firstName: 'Noa' },
      loading: false,
    })

    renderProtected()

    expect(screen.getByText(/secret map content/i)).toBeInTheDocument()
  })
})