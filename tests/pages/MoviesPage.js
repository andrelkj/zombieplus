const { expect } = require('@playwright/test');

export class MoviesPage {
  constructor(page) {
    this.page = page;
  }

  async isLoggedIn() {
    await this.page.waitForLoadState('networkidle'); // wait all network traffic is finished
    await expect(this.page).toHaveURL(/.*admin/);
  }

  async create(title, overview, company, release_year) {
    await this.page.locator('a[href$="register"]').click();
    await this.page.getByLabel('Titulo do filme').fill(title);
    await this.page.getByLabel('Sinopse').fill(overview);

    // select company by id                                                  
    await this.page
      .locator('#select_company_id .react-select__indicator')
      .click();

    await this.page
      .locator('.react-select__option')
      .filter({ hasText: company })
      .click();

    // select release year
    await this.page
      .locator('#select_year .react-select__indicator')
      .click();

    await this.page
      .locator('.react-select__option')
      .filter({ hasText: release_year })
      .click();
  }
}
