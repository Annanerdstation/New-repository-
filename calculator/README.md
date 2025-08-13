# Accessible Calculator

A production-ready calculator MVP built with React + TypeScript + Vite. Includes unit, UI, and end-to-end tests.

## Features
- Four operations: + − × ÷
- Decimals, clear (C), delete (⌫), equals (=)
- Keyboard support: digits, + - * / ., Enter (=), Escape (C), Backspace (⌫)
- Accessible: roles/labels, focus states, aria-live for results
- Responsive: mobile-friendly 4x5 grid; 0 key spans two columns

## Scripts
- `npm run dev` – start dev server
- `npm run build` – type-check and build
- `npm run preview` – preview production build
- `npm run test` – run unit/UI tests (Vitest)
- `npm run test:watch` – watch mode
- `npm run e2e` – run Playwright tests in headless mode
- `npm run e2e:headed` – run Playwright headed
- `npm run e2e:open` – open Playwright UI

## Testing
- Unit tests cover the pure evaluator and core UI behaviors.
- E2E tests validate common happy paths on desktop and mobile viewports.

## Accessibility
- `role="application"` with clear labels.
- Results area uses `aria-live="polite"` and visible focus rings.

## Development
1. Install deps: `npm install`
2. Start dev: `npm run dev`
3. Run unit tests: `npm run test`
4. Run e2e tests: `npm run e2e`

## Notes
- Locale: decimal separator is `.`
- Prevented invalid states: multiple decimals, operator chaining without operand, divide-by-zero shows `Error` and resets on next input.
