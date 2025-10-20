import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '@/playwright/pages/login';
import { ProductsPage } from '@pages/products';
import { HeaderPage } from '@pages/header';

export class E2E {

    private loginPage: LoginPage;
    private productsPage: ProductsPage;
    private headerPage: HeaderPage;
    private page: Page;

    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.productsPage = new ProductsPage(page);
        this.headerPage = new HeaderPage(page);
    }

    // Costruct e2e flows using the page objects in one simple class
    async processAPayment(username: string, password: string) {
        await test.step('Process a successful payment', async () => {
            await test.step('Login and wait for products page', async () => {
                await this.loginPage.load();
                await this.loginPage.waitLoad();
                await this.loginPage.submitSignInForm(username, password);
                await this.productsPage.waitLoad();
            });
            await test.step('Adding a product to the cart', async () => {
                await this.productsPage.waitLoad();
                await this.productsPage.addFirstProductToCart();
            });
            await test.step('Accessing the cart page', async () => {
                await this.headerPage.clickCartLink();
            });
        })

    }
}