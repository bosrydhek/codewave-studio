import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PromptSuggestions from './PromptSuggestions'
import React from 'react'

vi.mock('lucide-react', () => ({
  Sparkles: () => <div data-testid="sparkles-icon" />,
}))

describe('PromptSuggestions', () => {
  const suggestions = ['Suggestion 1', 'Suggestion 2']
  let onSelect: (suggestion: string) => void

  beforeEach(() => {
    onSelect = vi.fn()
  })

  it('renders suggestions correctly', () => {
    render(<PromptSuggestions suggestions={suggestions} onSelect={onSelect} />)

    expect(screen.getByText('Suggestion 1')).toBeDefined()
    expect(screen.getByText('Suggestion 2')).toBeDefined()
  })

  it.skip('calls onSelect when a suggestion is clicked', async () => {
    const localSuggestions = ['Suggestion 1', 'Suggestion 2']
    const localOnSelect = vi.fn()
    render(<PromptSuggestions suggestions={localSuggestions} onSelect={localOnSelect} />)

    const button = screen.getByTestId('suggestion-0')
    fireEvent.click(button)

    await new Promise((r) => setTimeout(r, 100))

    expect(localOnSelect).toHaveBeenCalledWith('Suggestion 1')
  })

  it('renders nothing when suggestions list is empty', () => {
    const { container } = render(<PromptSuggestions suggestions={[]} onSelect={onSelect} />)
    expect(container.firstChild).toBeNull()
  })
})
