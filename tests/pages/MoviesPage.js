const { expect } = require('@playwright/test');

export class MoviesPage {
  constructor(page) {
    this.page = page;
  }

  async isLoggedIn() {
    await this.page.waitForLoadState('networkidle'); // wait all network traffic is finished
    await expect(this.page).toHaveURL(/.*admin/);
  }
}
