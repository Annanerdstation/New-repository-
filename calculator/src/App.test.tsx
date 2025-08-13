import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import App from './App'

function mapAccessibleName(l: string): string {
  const map: Record<string, string> = {
    '+': 'Plus',
    '-': 'Minus',
    '×': 'Multiply',
    '÷': 'Divide',
    '=': 'Equals',
    'C': 'Clear',
    '⌫': 'Delete',
  }
  return map[l] ?? l
}

async function clickSequence(labels: string[]) {
  for (const label of labels) {
    const name = mapAccessibleName(label)
    await userEvent.click(screen.getByRole('button', { name }))
  }
}

describe('Calculator UI', () => {
  it('performs addition via buttons', async () => {
    render(<App />)
    await clickSequence(['1', '2', '+', '7', '='])
    expect(screen.getByLabelText('Current value')).toHaveTextContent('19')
    expect(screen.getByLabelText('Previous expression')).toHaveTextContent('')
  })

  it('supports keyboard input', async () => {
    render(<App />)
    await userEvent.keyboard('4')
    await userEvent.keyboard('5')
    await userEvent.keyboard('+')
    await userEvent.keyboard('6')
    await userEvent.keyboard('{Enter}')
    expect(screen.getByLabelText('Current value')).toHaveTextContent('51')
  })

  it('prevents multiple decimals', async () => {
    render(<App />)
    await clickSequence(['.', '.', '1'])
    expect(screen.getByLabelText('Current value')).toHaveTextContent('0.1')
  })

  it('backspace deletes last char only', async () => {
    render(<App />)
    await clickSequence(['1', '2', '3'])
    await userEvent.keyboard('{Backspace}')
    expect(screen.getByLabelText('Current value')).toHaveTextContent('12')
  })

  it('divide by zero shows Error and resets next input', async () => {
    render(<App />)
    await clickSequence(['8', '÷', '0', '='])
    expect(screen.getByLabelText('Current value')).toHaveTextContent('Error')
    await clickSequence(['7'])
    expect(screen.getByLabelText('Current value')).toHaveTextContent('7')
  })

  it('continues calculation after equals', async () => {
    render(<App />)
    await clickSequence(['1', '0', '÷', '2', '='])
    expect(screen.getByLabelText('Current value')).toHaveTextContent('5')
    await clickSequence(['+', '5', '='])
    expect(screen.getByLabelText('Current value')).toHaveTextContent('10')
  })
})