import { Page, Locator, test } from '@playwright/test';

export class HeaderPage {
    readonly page: Page;
    readonly cartLink: Locator;
    readonly signOutBtn: Locator;

    readonly url: string = '/cart';

    constructor(page: Page) {
        this.page = page;
        this.cartLink = page.locator('a[href="/cart"]').describe('cart link');
        this.signOutBtn = page.locator('header button[class="font-bold"]:nth-child(1)').describe('sign out button');
    }
    async clickCartLink() {
        await test.step('Click cart link', async () => {
            await this.cartLink.click();
        });
    }

    async clickSignOutBtn() {
        await test.step('Clicking on the sign out button', async () => {
            await this.signOutBtn.click();
        });
    }

}