import { Page, Locator, test } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly checkoutButton: Locator;
    readonly cartTotal: Locator;

    readonly url: string = '/cart';

    constructor(page: Page) {
        this.page = page;
        this.checkoutButton = page.locator('a[href="/checkout"]').describe('checkout button');
        this.cartTotal = page.locator('[data-testid="cart-total"]').describe('cart total');
    }
    async clickCheckoutButton() {
        await test.step('Clicking on the checkout button', async () => {
            await this.checkoutButton.click();
        });
    }
}