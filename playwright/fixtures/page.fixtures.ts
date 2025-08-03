import { test as base } from '@playwright/test';

import { LoginPage } from '@/playwright/pages/login';
import { ProductsPage } from '@pages/products';

// Declare page fixtures
type PageFixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
};

export const pageFixtures = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await page.goto('/login');
    await use(new LoginPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
});