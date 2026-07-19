import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi, afterEach } from 'vitest'
import EditDishModal from '../components/EditDishModal'

const sampleDish = {
  _id: 'dish-1',
  dishName: 'dragon bowl',
  restaurantName: 'The Naam',
  freeFrom: ['dairy', 'eggs'],
  modifications: ['No sauce'],
  otherModifications: '',
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('EditDishModal', () => {
  test('pre-fills the dish name and restaurant name', () => {
    render(
      <EditDishModal dish={sampleDish} onClose={vi.fn()} onSuccess={vi.fn()} />
    )

    expect(screen.getByDisplayValue('dragon bowl')).toBeInTheDocument()
    expect(screen.getByText('The Naam')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /edit dish/i })).toBeInTheDocument()
  })

  test('pre-selects allergen chips from the stored lowercase values', () => {
    render(
      <EditDishModal dish={sampleDish} onClose={vi.fn()} onSuccess={vi.fn()} />
    )

    // Stored lowercase 'dairy'/'eggs' map back to the capitalized chips
    expect(screen.getByRole('button', { name: 'Dairy' }).className).toContain('chip-active')
    expect(screen.getByRole('button', { name: 'Eggs' }).className).toContain('chip-active')
    expect(screen.getByRole('button', { name: 'Gluten' }).className).toContain('chip-inactive')
  })

  test('activates the Other chip and shows the input when the dish has custom modifications', () => {
    render(
      <EditDishModal
        dish={{ ...sampleDish, otherModifications: 'no tahini' }}
        onClose={vi.fn()}
        onSuccess={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: 'Other' }).className).toContain('chip-active')
    expect(screen.getByDisplayValue('no tahini')).toBeInTheDocument()
  })

  test('saves changes with a PUT request and calls onSuccess with the updated dish', async () => {
    const mockSuccess = vi.fn()
    const updatedDish = { ...sampleDish, dishName: 'buddha bowl' }

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => updatedDish,
      })
    )

    render(
      <EditDishModal dish={sampleDish} onClose={vi.fn()} onSuccess={mockSuccess} />
    )

    const nameInput = screen.getByDisplayValue('dragon bowl')
    await userEvent.clear(nameInput)
    await userEvent.type(nameInput, 'Buddha Bowl')
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }))

    expect(mockSuccess).toHaveBeenCalledWith(updatedDish)

    const [url, options] = fetch.mock.calls[0]
    expect(url).toContain('/api/dishes/dish-1')
    expect(options.method).toBe('PUT')
    expect(JSON.parse(options.body).dishName).toBe('Buddha Bowl')
  })

  test('shows an error when all allergens are removed before saving', async () => {
    render(
      <EditDishModal dish={sampleDish} onClose={vi.fn()} onSuccess={vi.fn()} />
    )

    await userEvent.click(screen.getByRole('button', { name: 'Dairy' }))
    await userEvent.click(screen.getByRole('button', { name: 'Eggs' }))
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }))

    expect(
      screen.getByText(/please select at least one allergen/i)
    ).toBeInTheDocument()
  })
})