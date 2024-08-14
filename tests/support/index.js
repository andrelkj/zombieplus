const { test: base, expect } = require('@playwright/test');

const { Leads } = require('../actions/Leads');
const { Login } = require('../actions/Login');
const { Movies } = require('../actions/Movies');
const { Toast } = require('../actions/Components');

// create a updated page context that extends the actual page plus all POM imports
const test = base.extend({
  page: async ({ page }, use) => {
    // store the original page context into a variable
    const context = page;

    // inject each individual page into the page context
    context['leads'] = new Leads(page);
    context['login'] = new Login(page);
    context['movies'] = new Movies(page);
    context['toast'] = new Toast(page);

    await use(context);
  },
});

export { test, expect };
