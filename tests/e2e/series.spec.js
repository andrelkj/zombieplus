const { test, expect } = require('../support');

const data = require('../support/fixtures/series.json');
const { executeSQL } = require('../support/database');

test.beforeAll(async () => {
  await executeSQL(`DELETE FROM public.movies`);
});

test('deve poder cadastrar uma nova série', async ({ page }) => {
  const serie = data.create;

  await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin');
  await page.series.create(serie);
});
