const { test, expect } = require('../support');

const data = require('../support/fixtures/series.json');
const { executeSQL } = require('../support/database');

test.beforeAll(async () => {
  await executeSQL(`DELETE FROM public.tvshows`);
});

test('deve poder cadastrar uma nova série', async ({ page }) => {
  const serie = data.create;

  await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin');
  await page.series.create(serie);
});

test('deve poder remover uma série', async ({ page, request }) => {
  const serie = data.to_remove;
  await request.api.postSerie(serie);

  await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin');
  await page.series.go();
  await page.series.remove(serie.title);
  await page.popup.haveText('Série removida com sucesso.');
});

test('não deve cadastrar quando o título é duplicado', async ({
  page,
  request,
}) => {
  const serie = data.duplicate;
  await request.api.postSerie(serie);

  await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin');
  await page.series.create(serie);
  await page.popup.haveText(
    `O título '${serie.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`
  );
});
