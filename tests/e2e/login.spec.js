const { test, expect } = require('@playwright/test');

const { LoginPage } = require('../pages/LoginPage');
const { Toast } = require('../pages/Components');

let loginPage;
let toast;

test.beforeEach(({ page }) => {
  loginPage = new LoginPage(page);
  toast = new Toast(page);
});

test('deve logar como administrador', async ({ page }) => {
  await loginPage.visit();
  await loginPage.submit('admin@zombieplus.com', 'pwd123');
  await loginPage.isLoggedIn();
});

test('não deve logar com senha incorreta', async ({ page }) => {
  await loginPage.visit();
  await loginPage.submit('admin@zombieplus.com', 'abc123');

  const message =
    'Oops!Ocorreu um erro ao tentar efetuar o login. Por favor, verifique suas credenciais e tente novamente.';
  await toast.haveText(message);
});

test('não deve logar quando o email é inválido', async ({ page }) => {
  await loginPage.visit();
  await loginPage.submit('admin.zombieplus.com', 'abc123');

  await loginPage.alertHaveText('Email incorreto');
});

test('não deve logar quando o email não é preenchido', async ({ page }) => {
  await loginPage.visit();
  await loginPage.submit('', 'abc123');

  await loginPage.alertHaveText('Campo obrigatório');
});

test('não deve logar quando a senha não é preenchido', async ({ page }) => {
  await loginPage.visit();
  await loginPage.submit('admin@zombieplus.com', '');

  await loginPage.alertHaveText('Campo obrigatório');
});

test('não deve logar quando nenhum campo é preenchido', async ({ page }) => {
  await loginPage.visit();
  await loginPage.submit('', '');

  await loginPage.alertHaveText(['Campo obrigatório', 'Campo obrigatório']);
});
