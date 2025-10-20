import { Page, Locator, test } from '@playwright/test';

export class HeaderPage {
    readonly page: Page;
    readonly cartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartLink = page.locator('a[href="/cart"]');
    }
    async clickCartLink() {
        await test.step('Clicking on the cart link', async () => {
            await this.cartLink.click();
        });
    }
}