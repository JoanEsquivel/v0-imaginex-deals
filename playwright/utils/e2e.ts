import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '@/playwright/pages/login';
import { ProductsPage } from '@pages/products';
import { HeaderPage } from '@pages/header';
import { CartPage } from '@pages/cart';
import { CheckoutPage } from '@pages/checkout';

export class E2E {

    private loginPage: LoginPage;
    private productsPage: ProductsPage;
    private headerPage: HeaderPage;
    private cartPage: CartPage;
    private checkoutPage: CheckoutPage;
    private page: Page;

    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.productsPage = new ProductsPage(page);
        this.headerPage = new HeaderPage(page);
        this.cartPage = new CartPage(page);
        this.checkoutPage = new CheckoutPage(page);
    }

    // Costruct e2e flows using the page objects in one simple class
    async processAPayment(username: string, password: string) {
        await test.step('Process a payment workflow', async () => {
            await test.step('Login and wait for products page', async () => {
                await this.loginPage.load();
                await this.loginPage.waitLoad();
                await this.loginPage.submitSignInForm(username, password);
                await this.productsPage.waitLoad();
            });
            await test.step('Adding a product to the cart', async () => {
                await this.productsPage.waitLoad();
                await expect(this.productsPage.page).toHaveURL(this.productsPage.url);
                await this.productsPage.addFirstProductToCart();
            });
            await test.step('Accessing the cart page', async () => {
                await this.headerPage.clickCartLink();
                await expect(this.cartPage.page).toHaveURL(this.cartPage.url);
            });
            await test.step('Clicking on the checkout button', async () => {
                await this.cartPage.clickCheckoutButton();
                await expect(this.checkoutPage.page).toHaveURL(this.checkoutPage.url);
            });
            await test.step('Filling the shipping form', async () => {
                await this.checkoutPage.fillShippingForm('testName', 'test@test.com', 'test address');
            });
            await test.step('Filling the payment form', async () => {
                await this.checkoutPage.fillPaymentForm('1234 1234 1234 1234', 'testNae', '02/30', '123');
            });
        })
    }
}