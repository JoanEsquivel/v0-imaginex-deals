import { test, Locator, Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly url: string = '/login';
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByRole('textbox', { name: 'Username' }).describe('username input');
        this.passwordInput = page.getByRole('textbox', { name: 'Password' }).describe('password input');
        this.signInButton = page.getByRole('button', { name: 'Sign In' }).describe('sign in button');
    }

    async load() {
        await test.step('Load login page', async () => {
            await this.page.goto(this.url);
        });
    }

    async waitLoad() {
        await test.step('Wait for login page to load', async () => {
            await this.usernameInput.waitFor({ state: 'visible' });
        });
    }

    async submitSignInForm(username: string, password: string) {
        await test.step('Fill sign in form and click sign in button', async () => {
            await this.usernameInput.fill(username);
            await this.passwordInput.fill(password);
            await this.signInButton.click();
        });
    }

}