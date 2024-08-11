const { test, expect } = require('@playwright/test');

test('deve logar como administrador', async ({ page }) => {
  await page.goto('http://localhost:3000/admin/login');

  const loginForm = page.locator('.login-form');
  await expect(loginForm).toBeVisible();
});
