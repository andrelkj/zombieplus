// @ts-check
const { test } = require('@playwright/test');
const { LandingPage } = require('./pages/LandingPage');

test('deve cadastrar um lead na fila de espera', async ({ page }) => {
  const landingPage = new LandingPage(page);
  const message =
    'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!';

  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm('Customer User', 'customer@test.com');
  await landingPage.toastHaveText(message);
});

test('não deve cadastrar com email incorreto', async ({ page }) => {
  const landingPage = new LandingPage(page);

  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm('Customer User', 'customer.test.com');
  await landingPage.alertHaveText('Email incorreto');
});

test('não deve cadastrar quando o nome não é preenchido', async ({ page }) => {
  const landingPage = new LandingPage(page);

  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm('', 'customer@test.com');
  await landingPage.alertHaveText('Campo obrigatório');
});

test('não deve cadastrar quando o email não é preenchido', async ({ page }) => {
  const landingPage = new LandingPage(page);

  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm('Customer User', '');
  await landingPage.alertHaveText('Campo obrigatório');
});

test('não deve cadastrar quando nenhum campo é preenchido', async ({
  page,
}) => {
  const landingPage = new LandingPage(page);

  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm('', '');
  await landingPage.alertHaveText(['Campo obrigatório', 'Campo obrigatório']);
});
