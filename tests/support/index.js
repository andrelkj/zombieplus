const { test: base, expect } = require('@playwright/test');

const { Leads } = require('./actions/Leads');
const { Login } = require('./actions/Login');
const { Movies } = require('./actions/Movies');
const { Popup } = require('./actions/Components');
const { Tvshows } = require('./actions/Tvshows');

const { Api } = require('./api');

// create a updated page context that extends the actual page plus all POM imports
const test = base.extend({
  page: async ({ page }, use) => {
    // store the original page context into a variable
    const context = page;

    // inject each individual page into the page context
    context['leads'] = new Leads(page);
    context['login'] = new Login(page);
    context['movies'] = new Movies(page);
    context['popup'] = new Popup(page);
    context['tvshows'] = new Tvshows(page);

    await use(context);
  },
  request: async ({ request }, use) => {
    const context = request;
    context['api'] = new Api(request);

    await context['api'].setToken();

    await use(context);
  },
});

export { test, expect };
