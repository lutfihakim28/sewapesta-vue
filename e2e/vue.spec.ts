import { test, expect } from '@playwright/test';

// See here how to get started:
// https://playwright.dev/docs/intro
test('visits the app root url without token', async ({ page }) => {
  // const token = await page.evaluate(() => localStorage.getItem('sewapesta-token'))
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded')
  expect(page.url()).toContain('/auth/login')
  // await expect(page.locator('h1')).toHaveText('You did it!');
})
