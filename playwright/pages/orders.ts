import { Page, Locator, test } from '@playwright/test';

export class OrdersPage {
    readonly page: Page;
    readonly ordersTitle: Locator;
    readonly url: string = '/orders';

    constructor(page: Page) {
        this.page = page;
        this.ordersTitle = page.locator('h1').filter({ hasText: 'Your Orders' }).describe('orders page title');
    }

    async load() {
        await test.step('Load orders page', async () => {
            await this.page.goto(this.url);
        });
    }

    async waitLoad() {
        await test.step('Wait for orders page to load', async () => {
            await this.ordersTitle.waitFor({ state: 'visible' });
        });
    }
}
