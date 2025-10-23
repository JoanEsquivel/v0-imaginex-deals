import { test as base } from '@playwright/test';
import { LoginPage } from '@/playwright/pages/login';
import { ProductsPage } from '@/playwright/pages/products';
import { HeaderPage } from '@/playwright/pages/header';

// Declare page fixtures
type PageFixture = {
    loginPage: LoginPage;
    productsPage: ProductsPage;
    headerPage: HeaderPage;
};

export const pageFixture = base.extend<PageFixture>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    productsPage: async ({ page }, use) => {
        await use(new ProductsPage(page));
    },
    headerPage: async ({ page }, use) => {
        await use(new HeaderPage(page));
    }
});