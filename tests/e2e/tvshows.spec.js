const { test, expect } = require('../support');

const data = require('../support/fixtures/tvshows.json');
const { executeSQL } = require('../support/database');

test.beforeAll(async () => {
  await executeSQL(`DELETE FROM public.tvshows`);
});

test('deve poder cadastrar uma nova série', async ({ page }) => {
  const tvshow = data.create;

  await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin');
  await page.tvshows.create(tvshow);
});

test('deve poder remover uma série', async ({ page, request }) => {
  const tvshow = data.to_remove;
  await request.api.postTvshow(tvshow);

  await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin');
  await page.tvshows.go();
  await page.tvshows.remove(tvshow.title);
  await page.popup.haveText('Série removida com sucesso.');
});

test('não deve cadastrar quando o título é duplicado', async ({
  page,
  request,
}) => {
  const tvshow = data.duplicate;
  await request.api.postTvshow(tvshow);

  await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin');
  await page.tvshows.create(tvshow);
  await page.popup.haveText(
    `O título '${tvshow.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`
  );
});

test('não deve cadastrar quando os campos obrigatórios não são preenchidos', async ({
  page,
}) => {
  await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin');

  await page.tvshows.go();
  await page.tvshows.goForm();
  await page.tvshows.submit();
  await page.tvshows.alertHaveText([
    'Campo obrigatório',
    'Campo obrigatório',
    'Campo obrigatório',
    'Campo obrigatório',
    'Campo obrigatório (apenas números)',
  ]);
});

test('deve realizar busca pelo termo zumbi', async ({ page, request }) => {
  const tvshows = data.search;

  tvshows.data.forEach(async (tvshow) => {
    await request.api.postTvshow(tvshow);
  });

  await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin');
  await page.tvshows.go();
  await page.tvshows.search(tvshows.input);
  await page.tvshows.tableHave(tvshows.outputs);
});
