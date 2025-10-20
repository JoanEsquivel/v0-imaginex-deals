# Manual for students

## How to setup Playwright in your project? Manually

1- Full guideline: [Installation](https://playwright.dev/docs/intro)
  * pnpm create playwright

2- If it just scaffold a test folder, let's reorganize it. How?
  * Create a new folder named playwright
  * Move the generated 'test' folder inside of the new 'playwright' folder.
  * In your playwright.config.ts, change the testDir to ```testDir: './playwright/tests',```

3- Is it working? Let's test it out: 
  * Run the command: ``` pnpm exec playwright test ```

4- You should get a message confirming that Playwright was executed: 
```
Running 6 tests using 4 workers
  6 passed (11.3s) ~ Something similar
```

## How to map web locators using XPath and CSS? 
How you can interact with web elements using Playwright? Playwright recommends some [built in locators](https://playwright.dev/docs/locators) that I recommend to use, if your project allows you to use them. However, you can also use the following strategies: 
- [CSS Locators - Full Guideline](https://youtu.be/_7bPbDAz-qg?si=ZqNNhTkyTMAH7SB6)
- [XPath Locators - Full Guideline](https://youtu.be/XyBxEnyBb0A?si=psy6xm-yn_hGeoiT)


## Login Test Logic Implementation
- Create a 'pages' folder under 'playwright'
- Create a new 'login.ts' file under the 'pages' folder
- Fill the page object with the expected props and behaviors
```
import { Page, Locator, test } from '@playwright/test';

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
```
- Create a 'fixtures' folder
- Under the 'fixtures' folder, create a new file named 'index.fixtures.ts' and 'page.fixture.ts'
- In our index.fixtures.ts let's pull the logic to merge our fixture in the index:
```
import { mergeTests } from '@playwright/test';
import { pageFixture } from '@/playwright/fixtures/page.fixtures';

export const test = mergeTests(pageFixture);

export { expect, request } from '@playwright/test';
```
- Expect a couple of warnings, it is expected.
- Now, let's construct the pages fixture:

```
  import { test as base } from '@playwright/test';

  import { LoginPage } from '@/playwright/pages/login';

  // Declare page fixtures
  type PageFixture = {
      loginPage: LoginPage;
  };

  export const pageFixture = base.extend<PageFixture>({
      loginPage: async ({ page }, use) => {
          await page.goto('/login');
          await use(new LoginPage(page));
      }
  });
```

- We are ready to create implement our login automated flow
- Enable the base url in the playwright.config.ts
```
  baseURL: 'http://localhost:3001',
```

- Change the example.spec.ts file with the following code:
```
  test.describe('Login Workflow', () => {
    test('should login with valid credentials', async ({ loginPage }) => {
      await loginPage.load();
      await loginPage.waitLoad();
      await loginPage.submitSignInForm('test_user', 'test_pass');
      await expect(loginPage.page).toHaveURL('/products');
    });
  });
```

- Run your test in UI mode  to see the results:
```
pnpm exec playwright test --ui
```

- Run it without the UI mode and check the steps documented in the report

## Let's keep the username, passwords, and sensitive data as secrets
- Run the command ```pnpm add dotenv ```
- Create a '.env' file in the root directory and add the sensitive data: 
```
SUCCESSFUL_USERNAME="test_user"
SUCCESSFUL_PASSWORD="test_pass"
```
- Let's extend the new env variables as types in node. 
- Create a 'types' folder under the 'playwright' folder
- Create a 'indext.ts' file under the 'types' folder
- In the 'indext.ts' file put: 
```
  declare namespace NodeJS {
    interface ProcessEnv {
      SUCCESSFUL_USERNAME: string;
      SUCCESSFUL_PASSWORD: string;
    }
  }
```
- Let's go back to our test and include: 

```
import 'dotenv/config'

const secrets: NodeJS.ProcessEnv = process.env;

```
- And change the hardcoded values for the secrets:
```
    await loginPage.submitSignInForm(secrets.SUCCESSFUL_USERNAME, secrets.SUCCESSFUL_PASSWORD);

```
- Now we have the sensitive information placed in an .env file, and make sure you don't version it to keep the information safe.
