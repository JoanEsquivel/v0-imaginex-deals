import { test as base } from '@playwright/test';
import { LoginPage } from '@/playwright/pages/login';

// Declare page fixtures
type PageFixture = {
    loginPage: LoginPage;
};

export const pageFixture = base.extend<PageFixture>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    }
});