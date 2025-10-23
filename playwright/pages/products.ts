import { Page, Locator, test } from '@playwright/test';

export class ProductsPage {
    readonly page: Page;
    readonly firstProductAddToCartBtn: Locator;
    readonly firstProductPrice: Locator;
    readonly firstProductTitle: Locator;


    readonly url: string = '/products';

    constructor(page: Page) {
        this.page = page;
        this.firstProductAddToCartBtn = page.locator('main [data-testid="product-card"]:nth-child(1) button').describe('first product add to cart button');
        this.firstProductPrice = page.locator('main div[data-testid="product-card"]:nth-child(1) span:nth-child(2)').describe('first product price');
        this.firstProductTitle = page.locator('main div[data-testid="product-card"]:nth-child(1) h3').describe('first product title');
    }

    async load() {
        await test.step('Load products page', async () => {
            await this.page.goto(this.url);
        });
    }

    async waitLoad() {
        await test.step('Wait for products page to load', async () => {
            await this.firstProductTitle.waitFor({ state: 'visible' });
        });
    }

    async addFirstProductToCart() {
        await test.step('Add first product to cart', async () => {
            await this.firstProductAddToCartBtn.click();
        });
    }
}