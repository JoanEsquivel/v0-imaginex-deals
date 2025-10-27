import { test, expect } from '@/playwright/fixtures/index.fixtures';
import 'dotenv/config'
const secrets: NodeJS.ProcessEnv = process.env;

test.describe('Header Functionality', () => {
    test('should log out successfully', async ({ loginPage, productsPage, headerPage }) => {
        await test.step('Logout', async () => {
            await test.step('Login and wait for products page', async () => {
                await loginPage.load();
                await loginPage.waitLoad();
                await loginPage.submitSignInForm(secrets.SUCCESSFUL_USERNAME, secrets.SUCCESSFUL_PASSWORD);
                await productsPage.page.waitForTimeout(500);
            });
            await test.step('Signing out', async () => {
                await headerPage.clickSignOutBtn();
            })
            await expect(loginPage.page).toHaveURL(loginPage.url);
        });
    });
});