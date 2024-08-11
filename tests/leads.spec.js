// @ts-check
const { test, expect } = require('@playwright/test');

test('should register a lead in the waiting list', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page
    .getByRole('button', { name: /Aperte o play/})
    .click();
});
