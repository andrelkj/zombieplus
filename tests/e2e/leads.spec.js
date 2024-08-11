// @ts-check
const { test } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

const { LandingPage } = require('../pages/LandingPage');
const { Toast } = require('../pages/Components');

let landingPage;
let toast;

let leadName;
let leadEmail;

test.beforeEach(async ({ page }) => {
  landingPage = new LandingPage(page);
  toast = new Toast(page);
});

test.beforeAll(async () => {
  leadName = faker.person.fullName();
  leadEmail = faker.internet.email();
});

test('deve cadastrar um lead na fila de espera', async ({ page }) => {
  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm(leadName, leadEmail);

  const message =
    'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!';
  await toast.haveText(message);
});

test('não deve cadastrar quando o email já existe', async ({ page }) => {
  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm(leadName, leadEmail);

  const message =
    'O endereço de e-mail fornecido já está registrado em nossa fila de espera.';
  await toast.haveText(message);
});

test('não deve cadastrar com email incorreto', async ({ page }) => {
  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm('Customer User', 'customer.test.com');
  await landingPage.alertHaveText('Email incorreto');
});

test('não deve cadastrar quando o nome não é preenchido', async ({ page }) => {
  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm('', 'customer@test.com');
  await landingPage.alertHaveText('Campo obrigatório');
});

test('não deve cadastrar quando o email não é preenchido', async ({ page }) => {
  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm('Customer User', '');
  await landingPage.alertHaveText('Campo obrigatório');
});

test('não deve cadastrar quando nenhum campo é preenchido', async ({
  page,
}) => {
  await landingPage.visit();
  await landingPage.openLeadModal();
  await landingPage.submitLeadForm('', '');
  await landingPage.alertHaveText(['Campo obrigatório', 'Campo obrigatório']);
});
