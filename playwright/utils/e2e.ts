import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '@/playwright/pages/login';
import { ProductsPage } from '@pages/products';

export class E2E {

    private loginPage: LoginPage;
    private productsPage: ProductsPage;
    private page: Page;

    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.productsPage = new ProductsPage(page);
    }

    // Costruct e2e flows using the page objects in one simple class
    async loginAndLogout(username: string, password: string) {
        await test.step('Login and wait for products page', async () => {
            await this.loginPage.load();
            await this.loginPage.submitSignInForm(username, password);
            await this.productsPage.waitLoad();
        });
        expect(this.page.url()).toContain(this.productsPage.url);
        await test.step('Sign out and wait for login page', async () => {
            await this.productsPage.signOut();
            await this.loginPage.waitLoad();
        });
        expect(this.page.url()).toContain(this.loginPage.url);

        // This is out of the scope of the test, I am just testing different features
        await test.step('Testing the step skip', async step => {
            await test.step('before running step', async () => {
                // Normal step
              });
      
              await test.step.skip('not yet ready', async () => {
                // This step is skipped
              });
      
              await test.step('after running step', async () => {
                // This step still runs even though the previous one was skipped
              });
        });

        await test.step('Testing the step timeout', async step => {
            await test.step('a step', async () => {
                // This step can time out separately from the test
              }, { timeout: 1000 });
        });      
    }
}