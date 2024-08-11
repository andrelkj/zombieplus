// @ts-check
const { test, expect } = require('@playwright/test');

test('cadastrar um lead na fila de espera', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByRole('button', { name: /Aperte o play/ }).click();

  // modal checkpoint
  await expect(page.getByTestId('modal').getByRole('heading')).toHaveText(
    'Fila de espera'
  );

  // submit modal
  await page.getByPlaceholder('Seu nome completo').fill('Customer User');
  await page.getByPlaceholder('Seu email principal').fill('customer@test.com');
  await page.getByTestId('modal').getByText('Quero entrar na fila!').click();

  // validate modal
  const message =
    'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!';
  await expect(page.locator('.toast')).toHaveText(message);

  await expect(page.locator('.toast')).toBeHidden({ timeout: 5000 });
});
