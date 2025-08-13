import { test, expect } from '@playwright/test'

test('happy path addition and keyboard', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('application', { name: 'Calculator' })).toBeVisible()
  // click 7 + 8 = 15
  await page.getByRole('button', { name: '7' }).click()
  await page.getByRole('button', { name: 'Plus' }).click()
  await page.getByRole('button', { name: '8' }).click()
  await page.getByRole('button', { name: 'Equals' }).click()
  await expect(page.getByLabel('Current value')).toHaveText('15')

  // keyboard 9 * 3 = 27
  await page.keyboard.type('9*3')
  await page.keyboard.press('Enter')
  await expect(page.getByLabel('Current value')).toHaveText('27')
})