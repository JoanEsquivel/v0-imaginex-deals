import { Page, Locator, test } from '@playwright/test';

export class HeaderPage {
    readonly page: Page;
    readonly cartLink: Locator;

    readonly url: string = '/cart';

    constructor(page: Page) {
        this.page = page;
        this.cartLink = page.locator('a[href="/cart"]').describe('cart link');
    }
    async clickCartLink() {
        await test.step('Click cart link', async () => {
            await this.cartLink.click();
        });
    }
}