import { Page, Locator, test} from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly signInBtn: Locator;
  readonly errorContainer: Locator;

  readonly url: string = '/login';

  constructor(page: Page) {
    this.page = page;
    this.username = page.getByRole('textbox', { name: 'Username' });
    this.password = page.getByRole('textbox', { name: 'Password' }).describe('password input');
    this.signInBtn = page.getByRole('button', { name: 'Sign In' }).describe('sign in button');
    this.errorContainer = page.locator('[data-testid="login-error"]').describe('error container');
  }

  async load() {
    await test.step('Load login page', async () => {
      await this.page.goto(this.url);
    });
  }

  async waitLoad() {
    await test.step('Wait for login page to load', async () => {
      await this.username.waitFor({ state: 'visible' });
    });
  }

  async submitSignInForm(username: string, password: string) {
    await test.step('Fill sign in form and click sign in button', async () => {
      await this.username.fill(username);
      await this.password.fill(password);
      await this.signInBtn.click();
    });
  }
}