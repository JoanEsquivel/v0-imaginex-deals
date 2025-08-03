import { Page, Locator, test } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly signOutButton: Locator;

  readonly url: string = '/products';

  constructor(page: Page) {
    this.page = page;
    this.signOutButton = page.getByRole('button', { name: 'Sign Out' }).describe('sign out button');
  }

  async waitLoad() {
    await test.step('Wait for products page to load', async () => {
      await this.signOutButton.waitFor({ state: 'visible' });
    });
  }

  async signOut() {
    await test.step('Click on sign out button', async () => {
      await this.signOutButton.click();
    });
  }
}