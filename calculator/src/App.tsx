import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { evaluate, type Operator } from './evaluator'

type InputKey =
  | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
  | '.'
  | '+' | '-' | '×' | '÷'
  | 'C' | '⌫' | '='

function isOperator(value: string): value is Operator {
  return value === '+' || value === '-' || value === '×' || value === '÷'
}

function App() {
  const [current, setCurrent] = useState<string>('0')
  const [previous, setPrevious] = useState<string>('')
  const [operator, setOperator] = useState<Operator | null>(null)
  const [justEvaluated, setJustEvaluated] = useState<boolean>(false)
  const liveRegionRef = useRef<HTMLDivElement | null>(null)

  const previousExpression = useMemo(() => {
    if (previous && operator) return `${previous} ${operator}`
    return ''
  }, [previous, operator])

  const pressDigit = useCallback((digit: string) => {
    setCurrent((curr) => {
      if (justEvaluated) {
        setJustEvaluated(false)
        return digit === '.' ? '0.' : digit
      }
      if (digit === '.') {
        if (curr.includes('.')) return curr
        return curr === '' ? '0.' : `${curr}.`
      }
      if (curr === '0') return digit
      if (curr === 'Error') return digit
      return curr + digit
    })
  }, [justEvaluated])

  const clearAll = useCallback(() => {
    setCurrent('0')
    setPrevious('')
    setOperator(null)
    setJustEvaluated(false)
  }, [])

  const backspace = useCallback(() => {
    setCurrent((curr) => {
      if (justEvaluated) {
        // After evaluation, backspace should clear result entry only
        setJustEvaluated(false)
        return '0'
      }
      if (curr === 'Error') return '0'
      if (curr.length <= 1) return '0'
      let next = curr.slice(0, -1)
      if (next === '-' || next === '') next = '0'
      return next
    })
  }, [justEvaluated])

  const chooseOperator = useCallback((op: Operator) => {
    setCurrent((curr) => {
      if (curr === 'Error') {
        // reset on any input
        setPrevious('')
        setOperator(null)
        setJustEvaluated(false)
        return '0'
      }
      if (operator && previous !== '' && !justEvaluated) {
        // prevent operator chaining without operand
        return curr
      }
      // Move current to previous and set operator
      setPrevious(curr)
      setOperator(op)
      setJustEvaluated(false)
      return '0'
    })
  }, [operator, previous, justEvaluated])

  const doEquals = useCallback(() => {
    setCurrent((curr) => {
      if (!operator || previous === '') return curr
      const result = evaluate(previous, operator, curr)
      if (result.type === 'error') {
        setPrevious('')
        setOperator(null)
        setJustEvaluated(true)
        return 'Error'
      }
      setPrevious('')
      setOperator(null)
      setJustEvaluated(true)
      return result.value
    })
  }, [operator, previous])

  useEffect(() => {
    // update aria-live manually in case screen readers miss updates of same value
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = current
    }
  }, [current])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key
      if (/^[0-9]$/.test(key)) {
        e.preventDefault()
        pressDigit(key)
        return
      }
      if (key === '.') {
        e.preventDefault()
        pressDigit('.')
        return
      }
      if (key === '+' || key === '-' || key === '*' || key === '/') {
        e.preventDefault()
        const mapped: Operator = key === '*' ? '×' : key === '/' ? '÷' : (key as Operator)
        chooseOperator(mapped)
        return
      }
      if (key === 'Enter' || key === '=') {
        e.preventDefault()
        doEquals()
        return
      }
      if (key === 'Escape') {
        e.preventDefault()
        clearAll()
        return
      }
      if (key === 'Backspace') {
        e.preventDefault()
        backspace()
        return
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [pressDigit, chooseOperator, doEquals, clearAll, backspace])

  const onButtonPress = (value: InputKey) => {
    if (value === 'C') return clearAll()
    if (value === '⌫') return backspace()
    if (value === '=') return doEquals()
    if (isOperator(value)) return chooseOperator(value)
    return pressDigit(value)
  }

  return (
    <div className="calculator" role="application" aria-label="Calculator">
      <div className="display" aria-live="polite" aria-atomic="true">
        <div className="previous" aria-label="Previous expression">{previousExpression}</div>
        <div className="current" aria-label="Current value" ref={liveRegionRef}>{current}</div>
      </div>

      <div className="grid" role="group" aria-label="Calculator keypad">
        {/* Row 1 */}
        <CalcButton label="C" ariaLabel="Clear" onPress={() => onButtonPress('C')} variant="action" />
        <CalcButton label="⌫" ariaLabel="Delete" onPress={() => onButtonPress('⌫')} variant="action" />
        <div aria-hidden="true" />
        <CalcButton label="÷" ariaLabel="Divide" onPress={() => onButtonPress('÷')} variant="operator" />

        {/* Row 2 */}
        <CalcButton label="7" onPress={() => onButtonPress('7')} />
        <CalcButton label="8" onPress={() => onButtonPress('8')} />
        <CalcButton label="9" onPress={() => onButtonPress('9')} />
        <CalcButton label="×" ariaLabel="Multiply" onPress={() => onButtonPress('×')} variant="operator" />

        {/* Row 3 */}
        <CalcButton label="4" onPress={() => onButtonPress('4')} />
        <CalcButton label="5" onPress={() => onButtonPress('5')} />
        <CalcButton label="6" onPress={() => onButtonPress('6')} />
        <CalcButton label="−" ariaLabel="Minus" onPress={() => onButtonPress('-')} variant="operator" />

        {/* Row 4 */}
        <CalcButton label="1" onPress={() => onButtonPress('1')} />
        <CalcButton label="2" onPress={() => onButtonPress('2')} />
        <CalcButton label="3" onPress={() => onButtonPress('3')} />
        <CalcButton label="+" ariaLabel="Plus" onPress={() => onButtonPress('+')} variant="operator" />

        {/* Row 5 */}
        <CalcButton label="0" className="span-two" onPress={() => onButtonPress('0')} />
        <CalcButton label="." onPress={() => onButtonPress('.')} />
        <CalcButton label="=" ariaLabel="Equals" onPress={() => onButtonPress('=')} variant="equals" />
      </div>
    </div>
  )
}

function CalcButton({ label, ariaLabel, onPress, variant, className }: {
  label: string
  ariaLabel?: string
  onPress: () => void
  variant?: 'operator' | 'action' | 'equals'
  className?: string
}) {
  const kind = variant ?? 'default'
  return (
    <button
      type="button"
      className={`btn ${kind} ${className ?? ''}`}
      aria-label={ariaLabel ?? label}
      onClick={onPress}
    >
      {label}
    </button>
  )
}

export default App
