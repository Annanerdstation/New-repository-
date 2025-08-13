export type Operator = '+' | '-' | '×' | '÷'

export type EvaluationResult =
  | { type: 'ok'; value: string }
  | { type: 'error'; message: string }

function toNumber(value: string): number | null {
  if (value === '' || value === '.') return null
  const num = Number(value)
  return Number.isFinite(num) ? num : null
}

function trimTrailingZeros(value: string): string {
  if (!value.includes('.')) return value
  // Remove trailing zeros after decimal and possible trailing dot
  return value.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '')
}

export function evaluate(left: string, operator: Operator, right: string): EvaluationResult {
  const a = toNumber(left)
  const b = toNumber(right)

  if (a === null || b === null) {
    return { type: 'error', message: 'Invalid expression' }
  }

  let result: number
  switch (operator) {
    case '+':
      result = a + b
      break
    case '-':
      result = a - b
      break
    case '×':
      result = a * b
      break
    case '÷':
      if (b === 0) return { type: 'error', message: 'Error' }
      result = a / b
      break
    default:
      return { type: 'error', message: 'Invalid operator' }
  }

  // Limit floating point noise and normalize
  const normalized = Number.isInteger(result) ? String(result) : result.toFixed(12)
  const trimmed = trimTrailingZeros(normalized)
  return { type: 'ok', value: trimmed }
}