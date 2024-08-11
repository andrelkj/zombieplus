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
