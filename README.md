# Playwright

## Commands

### Running tests

To run playwright tests we need to run `npx playwright test`

**Note:** playwright standard is to run tests in headless mode, you can run the assisted execution by adding --headed statement

Some common statements are:

- `--headed` to run the test in assisted mode
- `debug` to run the test execution step by step in debbuger mode
- `ui` to open playwright gui page

## Tricks

### Temporary elements

To work with temporary components like toasts you can set a checkpoint or timeout to wait for the toast

```js
await page.getByText('seus dados conosco').click();
```

use playwright ui `npx playwright test --ui` to look for it

and then use the following code to get page html content and look for the complete element you need

```js
// handling toast and temporary elements
const content = await page.content();
console.log(content);
```

**Note:** it might be required when working with temporary elements that are hard to interact with

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

It is possible to use regex with locators and arguments or expected messages to create a more dynamic and reusable test structure

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
