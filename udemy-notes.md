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

## Let's start structuring our e2e workflow

- Create a products page object:
```
pages/products.ts
import { Page, Locator, test } from '@playwright/test';

export class ProductsPage {
    readonly page: Page;
    readonly firstProductAddToCartBtn: Locator;
    readonly firstProductPrice: Locator;
    readonly firstProductTitle: Locator;


    readonly url: string = '/products';

    constructor(page: Page) {
        this.page = page;
        this.firstProductAddToCartBtn = page.locator('main [data-testid="product-card"]:nth-child(1) button');
        this.firstProductPrice = page.locator('main div[data-testid="product-card"]:nth-child(1) span:nth-child(2)')
        this.firstProductTitle = page.locator('main div[data-testid="product-card"]:nth-child(1) h3')
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
```
- Create a header page object
```
header.ts

import { Page, Locator, test } from '@playwright/test';

export class HeaderPage {
    readonly page: Page;
    readonly cartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartLink = page.locator('a[href="/cart"]');
    }
    async clickCartLink() {
        await test.step('Click cart link', async () => {
            await this.cartLink.click();
        });
    }
}
```

- Update the page.fixtures.ts with the newest page objects

```
import { test as base } from '@playwright/test';

import { LoginPage } from '@/playwright/pages/login';
import { ProductsPage } from '@/playwright/pages/products';
import { HeaderPage } from '@/playwright/pages/header';

// Declare page fixtures
type PageFixture = {
    loginPage: LoginPage;
    productsPage: ProductsPage;
    headerPage: HeaderPage;
};

export const pageFixture = base.extend<PageFixture>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    productsPage: async ({ page }, use) => {
        await use(new ProductsPage(page));
    },
    headerPage: async ({ page }, use) => {
        await use(new HeaderPage(page));
    }
});
```

- Rename the 'example.spec.ts' to 'payment-workflows.spec.ts'
- And let's implement the new page objects in our test and let's add some logic to our test suite
```
 import { test, expect } from '@/playwright/fixtures/index.fixtures';
import 'dotenv/config'

const secrets: NodeJS.ProcessEnv = process.env;



test.describe('Payment Workflows', () => {
  test('should process a successful payment', async ({ loginPage, productsPage, headerPage }) => {
    await loginPage.load();
    await loginPage.waitLoad();
    await loginPage.submitSignInForm(secrets.SUCCESSFUL_USERNAME, secrets.SUCCESSFUL_PASSWORD);
    await expect(loginPage.page).toHaveURL('/products');
    await productsPage.load();
    await productsPage.waitLoad();
    await productsPage.addFirstProductToCart();
    await headerPage.clickCartLink();
    await expect(headerPage.page).toHaveURL('/cart');
  });

  test('should process a failed payment', async ({ loginPage, productsPage, headerPage }) => {
    await loginPage.load();
    await loginPage.waitLoad();
    await loginPage.submitSignInForm(secrets.SUCCESSFUL_USERNAME, secrets.SUCCESSFUL_PASSWORD);
    await expect(loginPage.page).toHaveURL('/products');
    await productsPage.load();
    await productsPage.waitLoad();
    await productsPage.addFirstProductToCart();
    await headerPage.clickCartLink();
    await expect(headerPage.page).toHaveURL('/cart');
  });
});



```

- Notice that we have multiple objects interacting correctly, but if we want another test to check when the system does not complete the payment, we may need to reuse a lot of the same code. 

- What is the solution? Let's create a helper for the workflow that combines the interaction of multiple page objects in e2e methods. How? It is pretty easy: 


- Let's create a folder under 'playwright' named 'utils'
- Then, under that folder, let's create the file 'e2e.ts'. The logic for it follows:
```
import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '@/playwright/pages/login';
import { ProductsPage } from '@pages/products';
import { HeaderPage } from '@pages/header';

export class E2E {

    private loginPage: LoginPage;
    private productsPage: ProductsPage;
    private headerPage: HeaderPage;
    private page: Page;

    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.productsPage = new ProductsPage(page);
        this.headerPage = new HeaderPage(page);
    }

    // Costruct e2e flows using the page objects in one simple class
    async processAPayment(username: string, password: string) {
        await test.step('Process a successful payment', async () => {
            await test.step('Login and wait for products page', async () => {
                await this.loginPage.load();
                await this.loginPage.waitLoad();
                await this.loginPage.submitSignInForm(username, password);
                await this.productsPage.waitLoad();
            });
            await test.step('Adding a product to the cart', async () => {
                await this.productsPage.waitLoad();
                await this.productsPage.addFirstProductToCart();
            });
            await test.step('Accessing the cart page', async () => {
                await this.headerPage.clickCartLink();
            });
        })

    }
}
```

- However, I want this framework to be flexible. I want the tests to have the ability to use page objects, but also the E2E methods. So, I need a new fixture: 
```
import { E2E } from '@/playwright/utils/e2e';
import { test as base } from '@playwright/test';

type E2EFixture = {
    e2e: E2E;
};

export const e2eFixture = base.extend<E2EFixture>({
    e2e: async ({ page }, use) => {
        const e2e = new E2E(page);
        await use(e2e);
    },
});

```

- And then, I need to merge it in our index.fixtures.ts
```
import { mergeTests } from '@playwright/test';
import { pageFixture } from '@/playwright/fixtures/page.fixtures';
import { e2eFixture } from '@/playwright/fixtures/e2e.fixtures';

export const test = mergeTests(pageFixture, e2eFixture);

export { expect, request } from '@playwright/test';
```

- And just like that, we can use our e2e fixture in our test, with all the logic in one place. Let's re-write the test file 'payment-workflows.spec.ts':

```
import { test, expect } from '@/playwright/fixtures/index.fixtures';
import 'dotenv/config'

const secrets: NodeJS.ProcessEnv = process.env;

test.describe('Payment Workflows', () => {
  test('should process a successful payment', async ({ e2e, headerPage }) => {
    e2e.processAPayment(secrets.SUCCESSFUL_USERNAME, secrets.SUCCESSFUL_PASSWORD);
    await expect(headerPage.page).toHaveURL('/cart');
  });

  test('should process a failed payment', async ({ e2e, headerPage }) => {
    e2e.processAPayment(secrets.SUCCESSFUL_USERNAME, secrets.SUCCESSFUL_PASSWORD);
    await expect(headerPage.page).toHaveURL('/cart');
  });
});

```
