const { test: base, expect } = require('@playwright/test');

const { LandingPage } = require('../pages/LandingPage');
const { LoginPage } = require('../pages/LoginPage');
const { MoviesPage } = require('../pages/MoviesPage');
const { Toast } = require('../pages/Components');

// create a updated page context that extends the actual page plus all POM imports
const test = base.extend({
  page: async ({ page }, use) => {
    // store the original page context into a variable
    const context = page;

    // inject each individual page into the page context
    context['landing'] = new LandingPage(page);
    context['login'] = new LoginPage(page);
    context['movies'] = new MoviesPage(page);
    context['toast'] = new Toast(page);

    await use(context);
  },
});

export { test, expect };
