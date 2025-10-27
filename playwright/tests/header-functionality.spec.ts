import { test, expect } from '@/playwright/fixtures/index.fixtures';
import 'dotenv/config'
const secrets: NodeJS.ProcessEnv = process.env;

test.describe('Header Functionality', () => {
    test('should navigate to orders page when clicking Returns & Orders', async ({ loginPage, productsPage, headerPage, ordersPage }) => {
        await test.step('Navigate to Returns & Orders', async () => {
            await test.step('Login and wait for products page', async () => {
                await loginPage.load();
                await loginPage.waitLoad();
                await loginPage.submitSignInForm(secrets.SUCCESSFUL_USERNAME, secrets.SUCCESSFUL_PASSWORD);
                await productsPage.page.waitForTimeout(500);
            });
            await test.step('Click Returns & Orders link', async () => {
                await headerPage.clickReturnsOrdersLink();
            });
            await test.step('Verify navigation to orders page', async () => {
                await expect(ordersPage.page).toHaveURL(ordersPage.url);
                await ordersPage.waitLoad();
            });
        });
    });

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