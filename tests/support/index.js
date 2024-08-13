const { test: base, expect } = require('@playwright/test');

const { LandingPage } = require('../pages/LandingPage');
const { LoginPage } = require('../pages/LoginPage');
const { MoviesPage } = require('../pages/MoviesPage');
const { Toast } = require('../pages/Components');

// create a updated page context that extends the actual page plus all POM imports
const test = base.extend({
  page: async ({ page }, use) => {
    await use({
      ...page,
      landing: new LandingPage(page),
      login: new LoginPage(page),
      movies: new MoviesPage(page),
      toast: new Toast(page),
    });
  },
});

export { test, expect };
