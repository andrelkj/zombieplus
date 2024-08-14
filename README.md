# Playwright

![poster](https://raw.githubusercontent.com/qaxperience/thumbnails/main/playwright-zombie.png)

## 🤘 About

Repository for the Zombie Plus system's automated test project, built during the Playwright Zombie Edition course! Playwright is an open-source tool developed by Microsoft that revolutionizes test automation in web systems, offering an effective and highly reliable approach.

## 💻 Technologies

- Node.js
- Playwright
- Javascript
- Faker
- PostgreSQL

## 🤖 How to run

1. Clone the repository, install dependencies with `npm install`
2. Run tests in Headless mode with `npx playwright test`
3. View the test report with `npx playwright show-report`

## 📊 Database

We are using Postgres SQL as the main database that is running locally through Docker containers. In order to stablish connection to the postgres database we installed the pg library `npm i pg --save-dev`.

## ⚙️ Commands

### Running tests

To run playwright tests we need to run `npx playwright test`.

**Note:** playwright standard is to run tests in headless mode, you can run the assisted execution by adding --headed statement.

Some common statements are:

- `--headed` to run the test in assisted mode
- `debug` to run the test execution step by step in debbuger mode
- `ui` to open playwright gui page

## 💡 Tricks

### Temporary elements

To work with temporary components like toasts you can set a checkpoint or timeout to wait for the toast,

```js
await page.getByText('seus dados conosco').click();
```

use playwright ui `npx playwright test --ui` to look for it, and then use the following code to get page html content and look for the complete element you need.

```js
// handling toast and temporary elements
const content = await page.content();
console.log(content);
```

**Note:** it might be required when working with temporary elements that are hard to interact with.

### Validation of elements with same locator

Playwright handles validations against the same element locator or multielement locators as a forEach loop. It means that you can use arrays to declare what is expected and playwright will run it as a loop for each locator found to the given selector:

```js
// working with multielement locators
await expect(page.locator('.alert')).toHaveText([
  'Campo obrigatório',
  'Campo obrigatório',
]);
```

### Regex

It is possible to use regex with locators and arguments or expected messages to create a more dynamic and reusable test structure.

Using regex to get only a piece of the url:

```js
  async isLoggedIn() {
    await this.page.waitForLoadState('networkidle'); // wait all network traffic is finished
    await expect(this.page).toHaveURL(/.*admin/);
  }
```

Using CSS selectors with regex `span[class$=alert]` to simplify element search:

```js
  async alertHaveText(text) {
    const alert = this.page.locator('span[class$=alert]');
    await expect(alert).toHaveText(text);
  }
```

### Snake case

Javascript standard convension is to use camelCase model, although we are using snake_case notation in the [MoviesPage](./tests/pages/MoviesPage.js) just to match this project database and REST API notation which can provide a better data handling and management.

### Elements relation by label

in HTML when there is a label for using the same value as the id of a child element it stablish a connection in between these elements:

```html
<label for="title" class="sc-kAyceB cmzCot"
  ><span class="field-name">Titulo do filme</span
  ><input name="title" id="title" placeholder="Digite aqui" value=""
/></label>
```

**Note:** the for value of the label (title) is the same as the input id value (title) which imply that they are related to each other.

and playwright allow you to use `getByLabel` function to look for the child element based into this connection:

```js
  async create(title, overview, company, release_year) {
    await this.page.locator('a[href$="register"]').click()
    await this.page.getByLabel('Titulo do filme').fill(title)
  }
```

### Database connection for reliable and reusable test data

When working with tests data require data injection, a good practice is to stablish connections with the available database to manage the data available easly.

By using this approach you can generate independent, reusable, fresh data on every test execution, avoiding:

- storage space consumption
- flaky tests caused by mutable shared data
- large loads of data to handle

To connect with the database we first need to provide the credentials:

```js
const DbConfig = {
  user: 'username', // username to access your
  host: 'localhost', // since where running locally
  database: 'dbname', // db name where you want to run the query against
  password: 'password', // password to access your database
  port: 5432,
};
```

**Note:** you can get this information into your database properties.

then you stablesh the connection, handling errors with:

```js
export async function executeSQL(sqlScript) {
  const pool = new Pool(DbConfig);

  try {
    const client = await pool.connect();

    const result = await client.query(sqlScript);
    console.log(result.rows);
  } catch (error) {
    console.log('Erro ao executar o SQL ' + error);
  }
}
```

### Centralize Page Object Model (POM) imports

When using POM it is required to import each page context so you can actually use their own functions, as the application grows this imports can get out of hand though and represent a lot of your code lines.

One way to handle it is by defining a [index.js](./tests/support/index.js) file in the support folder that will empower the existent page context from playwright with all of your imports:

```js
const { test: base } = require('@playwright/test');

const { LandingPage } = require('../pages/LandingPage');
const { LoginPage } = require('../pages/LoginPage');
const { MoviesPage } = require('../pages/MoviesPage');
const { Toast } = require('../pages/Components');

// create a updated page context that extends the actual page plus all POM imports injected
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

export { test };
```

after that you can replace the test import from playwright to your new context inside your test file:

```js
// standard test import from playwright
const { test: base } = require('@playwright/test');
```

```js
// new import from index.js
const { test } = require('../support');
```

**Note:** Javascript understands index.js files as the main ones, it means that even though you don't expecify it whitin the import this file will be use.

at the end you just need to update your test case to use the new format and remove all the old imports:

```js
const { test } = require('../support');

const data = require('../support/fixtures/movies.json');
const { executeSQL } = require('../support/database');

test('deve poder cadastrar um novo filme', async ({ page }) => {
  // é importante estar logado
  const movie = data.create;
  await executeSQL(`DELETE FROM public.movies WHERE title = '${movie.title}';`);

  await page.login.visit();
  await page.login.submit('admin@zombieplus.com', 'pwd123');
  await page.movies.isLoggedIn();

  await page.movies.create(
    movie.title,
    movie.overview,
    movie.company,
    movie.release_year
  );
  await page.toast.containText('Cadastro realizado com sucesso!');
});
```

**Note:** although it helps to centralize all import into a single file you need to consider it's impact into the execution performance once you'll load the context of all pages everytime instead of only the page specific contexts as before.

#### Update to import standard functions from page context

The approach used above to inject can be applied to centralize POM imports, but it causes standard playwright functions that comes with the page context to be lost.

In order to fix that we updated the [index.js](./tests/support/index.js) file to store the original page content into a variable and then injecting each individual page initialization to it:

```js
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
```

**Note:** at this point you should be able to use both native playwright and page specific functions.

## ✅ Best practices

### Page Object Model (POM)

When using POM it is import to keep the rules and folder structure to the letter so you avoid management issues in the future.

As an example we have the `isLoggedIn` function that is part of the user login validation and was previously defined inside the LoginPage,

```js
  async isLoggedIn() {
    await this.page.waitForLoadState('networkidle'); // wait all network traffic is finished
    await expect(this.page).toHaveURL(/.*admin/);
  }
```

although once you log in into the application you're no longer in the login page but in the movies page instead, so we created the [MoviesPage](./tests/pages/MoviesPage.js) file and moved the `isLoggedIn` function to it, and updated the [login spec](./tests/e2e/login.spec.js) to keep up with the new page:

```js
test('deve logar como administrador', async ({ page }) => {
  await loginPage.visit();
  await loginPage.submit('admin@zombieplus.com', 'pwd123');
  await moviesPage.isLoggedIn();
});
```

### Custom Actions

Differently than the POM, custom actions model focus on specific and possible actions breaking free from the pages concept to allow a more flexible approach (e.g. [Movies.js](./tests/actions/Movies.js) file will contain all actions related to movies - create, delete, and so on).

To make this change we updated the pages folder name to actions, removed Page from the file names and classes, and then made the required changes within the code:

Changes in [index.js](./tests/support/index.js) file to import the new classes and files:

```js
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
```

Changes in the [leads.spec.js](./tests/e2e/leads.spec.js) file to call **leads** instead of **landingPage**:

```js
const { test, expect } = require('../support');
const { faker } = require('@faker-js/faker');

test('deve cadastrar um lead na fila de espera', async ({ page }) => {
  const leadName = faker.person.fullName();
  const leadEmail = faker.internet.email();

  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm(leadName, leadEmail);

  const message =
    'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!';
  await page.toast.containText(message);
});

test('não deve cadastrar quando o email já existe', async ({
  page,
  request,
}) => {
  const leadName = faker.person.fullName();
  const leadEmail = faker.internet.email();

  // send a new lead through API
  const newLead = await request.post('http://localhost:3333/leads', {
    data: {
      name: leadName,
      email: leadEmail,
    },
  });

  // confirm status OK is returned (200-299)
  expect(newLead.ok()).toBeTruthy();

  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm(leadName, leadEmail);

  const message =
    'O endereço de e-mail fornecido já está registrado em nossa fila de espera.';
  await page.toast.containText(message);
});

test('não deve cadastrar com email incorreto', async ({ page }) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm('Customer User', 'customer.test.com');
  await page.leads.alertHaveText('Email incorreto');
});

test('não deve cadastrar quando o nome não é preenchido', async ({ page }) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm('', 'customer@test.com');
  await page.leads.alertHaveText('Campo obrigatório');
});

test('não deve cadastrar quando o email não é preenchido', async ({ page }) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm('Customer User', '');
  await page.leads.alertHaveText('Campo obrigatório');
});

test('não deve cadastrar quando nenhum campo é preenchido', async ({
  page,
}) => {
  await page.leads.visit();
  await page.leads.openLeadModal();
  await page.leads.submitLeadForm('', '');
  await page.leads.alertHaveText(['Campo obrigatório', 'Campo obrigatório']);
});
```

---

Curso disponível em https://qaxperience.com
