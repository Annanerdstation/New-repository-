import { describe, it, expect } from 'vitest'
import { evaluate, type Operator } from './evaluator'

const ops: Operator[] = ['+', '-', '×', '÷']

describe('evaluate()', () => {
  it('adds numbers', () => {
    expect(evaluate('12', '+', '7')).toEqual({ type: 'ok', value: '19' })
  })

  it('subtracts numbers', () => {
    expect(evaluate('20', '-', '5')).toEqual({ type: 'ok', value: '15' })
  })

  it('multiplies numbers', () => {
    expect(evaluate('3', '×', '4')).toEqual({ type: 'ok', value: '12' })
  })

  it('divides numbers', () => {
    expect(evaluate('10', '÷', '4')).toEqual({ type: 'ok', value: '2.5' })
  })

  it('trims floating point noise', () => {
    // 0.1 + 0.2 -> 0.3
    expect(evaluate('0.1', '+', '0.2')).toEqual({ type: 'ok', value: '0.3' })
  })

  it('errors on divide by zero', () => {
    expect(evaluate('5', '÷', '0')).toEqual({ type: 'error', message: 'Error' })
  })

  it('errors on invalid numbers', () => {
    expect(evaluate('', '+', '1').type).toBe('error')
    expect(evaluate('.', '+', '1').type).toBe('error')
  })
})