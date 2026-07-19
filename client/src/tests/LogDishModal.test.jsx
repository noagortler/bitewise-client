import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi, afterEach } from 'vitest'
import LogDishModal from '../components/LogDishModal'

const sampleRestaurant = {
  googlePlaceId: 'place-123',
  name: 'Blue Canoe Waterfront Restaurant',
  address: '3866 Bayview St, Richmond',
  phone: '',
  website: '',
  location: { lat: 49.12, lng: -123.18 },
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('LogDishModal', () => {
  test('shows the restaurant name in the header', () => {
    render(
      <LogDishModal
        restaurant={sampleRestaurant}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    )

    expect(screen.getByText(/blue canoe waterfront restaurant/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /log a dish/i })).toBeInTheDocument()
  })

  test('shows an error when submitting without a dish name', async () => {
    const mockSuccess = vi.fn()

    render(
      <LogDishModal
        restaurant={sampleRestaurant}
        onClose={vi.fn()}
        onSuccess={mockSuccess}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: /log dish/i }))

    expect(screen.getByText(/please enter a dish name/i)).toBeInTheDocument()
    expect(mockSuccess).not.toHaveBeenCalled()
  })

  test('shows an error when no allergens are selected', async () => {
    render(
      <LogDishModal
        restaurant={sampleRestaurant}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    )

    await userEvent.type(screen.getByPlaceholderText(/mushroom burger/i), 'Veggie Wrap')
    await userEvent.click(screen.getByRole('button', { name: /log dish/i }))

    expect(
      screen.getByText(/please select at least one allergen/i)
    ).toBeInTheDocument()
  })

  test('toggles allergen chips on and off', async () => {
    render(
      <LogDishModal
        restaurant={sampleRestaurant}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    )

    const glutenChip = screen.getByRole('button', { name: 'Gluten' })

    await userEvent.click(glutenChip)
    expect(glutenChip.className).toContain('chip-active')

    await userEvent.click(glutenChip)
    expect(glutenChip.className).toContain('chip-inactive')
  })

  test('shows the other modifications input only when Other is selected', async () => {
    render(
      <LogDishModal
        restaurant={sampleRestaurant}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    )

    expect(screen.queryByPlaceholderText(/no tahini/i)).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Other' }))

    expect(screen.getByPlaceholderText(/no tahini/i)).toBeInTheDocument()
  })

  test('submits the dish and calls onSuccess with the response data', async () => {
    const mockSuccess = vi.fn()
    const createdDish = { _id: 'dish-1', restaurantId: 'rest-1', dishName: 'veggie wrap' }

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => createdDish,
      })
    )

    render(
      <LogDishModal
        restaurant={sampleRestaurant}
        onClose={vi.fn()}
        onSuccess={mockSuccess}
      />
    )

    await userEvent.type(screen.getByPlaceholderText(/mushroom burger/i), 'Veggie Wrap')
    await userEvent.click(screen.getByRole('button', { name: 'Gluten' }))
    await userEvent.click(screen.getByRole('button', { name: /log dish/i }))

    expect(mockSuccess).toHaveBeenCalledWith(createdDish)

    // The request body sends the trimmed name and lowercased allergens
    const requestBody = JSON.parse(fetch.mock.calls[0][1].body)
    expect(requestBody.dish.dishName).toBe('Veggie Wrap')
    expect(requestBody.dish.freeFrom).toEqual(['gluten'])
    expect(requestBody.restaurant.googlePlaceId).toBe('place-123')
  })

  test('shows the server error message when the API rejects the dish', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'At least one allergen must be selected' }),
      })
    )

    render(
      <LogDishModal
        restaurant={sampleRestaurant}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    )

    await userEvent.type(screen.getByPlaceholderText(/mushroom burger/i), 'Veggie Wrap')
    await userEvent.click(screen.getByRole('button', { name: 'Gluten' }))
    await userEvent.click(screen.getByRole('button', { name: /log dish/i }))

    expect(
      await screen.findByText(/at least one allergen must be selected/i)
    ).toBeInTheDocument()
  })

  test('calls onClose when cancel is clicked', async () => {
    const mockClose = vi.fn()

    render(
      <LogDishModal
        restaurant={sampleRestaurant}
        onClose={mockClose}
        onSuccess={vi.fn()}
      />
    )

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))

    expect(mockClose).toHaveBeenCalled()
  })
})