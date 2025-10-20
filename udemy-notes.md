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


## Finish the payment workflow test

- Let's map the cart page object. Create 'cart.ts' under 'playwright/pages'
```
import { Page, Locator, test } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly checkoutButton: Locator;
    readonly cartTotal: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkoutButton = page.locator('a[href="/checkout"]');
        this.cartTotal = page.locator('[data-testid="cart-total"]');
    }
    async clickCheckoutButton() {
        await test.step('Clicking on the checkout button', async () => {
            await this.checkoutButton.click();
        });
    }
}
```

- Let's map it as part of the page fixtures
```
import { test as base } from '@playwright/test';

import { LoginPage } from '@/playwright/pages/login';
import { ProductsPage } from '@/playwright/pages/products';
import { HeaderPage } from '@/playwright/pages/header';
import { CartPage } from '@/playwright/pages/cart';

// Declare page fixtures
type PageFixture = {
    loginPage: LoginPage;
    productsPage: ProductsPage;
    headerPage: HeaderPage;
    cartPage: CartPage;
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
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    }
});
```

- Let's implement the click on the checkout button in the helper, and make some small extra configurations: 

```
import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '@/playwright/pages/login';
import { ProductsPage } from '@pages/products';
import { HeaderPage } from '@pages/header';
import { CartPage } from '@pages/cart';

export class E2E {

    private loginPage: LoginPage;
    private productsPage: ProductsPage;
    private headerPage: HeaderPage;
    private cartPage: CartPage;
    private page: Page;

    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.productsPage = new ProductsPage(page);
        this.headerPage = new HeaderPage(page);
        this.cartPage = new CartPage(page);
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
                await expect(this.productsPage.page).toHaveURL(this.productsPage.url);
                await this.productsPage.addFirstProductToCart();
            });
            await test.step('Accessing the cart page', async () => {
                await this.headerPage.clickCartLink();
                await expect(this.cartPage.page).toHaveURL(this.cartPage.url);
            });
            await test.step('Clicking on the checkout button', async () => {
                await this.cartPage.clickCheckoutButton();
            });
        })

    }
}

```

- Let's run our test script, and get rid of the assertion: 

```
test.describe('Payment Workflows', () => {
  test('should process a successful payment', async ({ e2e, headerPage }) => {
    await e2e.processAPayment(secrets.SUCCESSFUL_USERNAME, secrets.SUCCESSFUL_PASSWORD);
  });

  test('should process a failed payment', async ({ e2e, headerPage }) => {
     await e2e.processAPayment(secrets.SUCCESSFUL_USERNAME, secrets.SUCCESSFUL_PASSWORD);
  });
});
```

- Let's map the checkout page

```
checkout.ts
import { Page, Locator, test } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    // Shipping form
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly addressInput: Locator;
    readonly continueButton: Locator;

    // Payment form
    readonly cardNumberInput: Locator;
    readonly cardNameInput: Locator;
    readonly expiryDateInput: Locator;
    readonly cvvInput: Locator;
    readonly placeOrderButton: Locator;

    // Order placed confirmation
    readonly orderPlacedConfirmation: Locator;
    readonly transactionId: Locator;

    // Error messages
    readonly paymentError: Locator;

    constructor(page: Page) {
        this.page = page;
        // Shipping form
        this.nameInput = page.locator('input[data-testid="shipping-name"]');
        this.emailInput = page.locator('input[data-testid="shipping-email"]');
        this.addressInput = page.locator('[data-testid="shipping-address"]');
        this.continueButton = page.locator('button[data-testid="continue-to-payment-button"]');
        // Payment form
        this.cardNumberInput = page.locator('input[data-testid="card-number-input"]');
        this.cardNameInput = page.locator('input[data-testid="card-name-input"]');
        this.expiryDateInput = page.locator('input[data-testid="expiry-date-input"]');
        this.cvvInput = page.locator('input[data-testid="cvv-input"]');
        this.placeOrderButton = page.locator('button[data-testid="place-order-button"]');
        // Order placed confirmation
        this.orderPlacedConfirmation = page.locator('h2');
        this.transactionId = page.locator('[data-testid="transaction-id"]');
        // Error messages
        this.paymentError = page.locator('[data-testid="payment-error"]');
    }
    readonly url: string = '/checkout';

    async fillShippingForm(name: string, email: string, address: string) {
        await test.step('Filling the shipping form', async () => {
            await this.nameInput.fill(name);
            await this.emailInput.fill(email);
            await this.addressInput.fill(address);
            await this.continueButton.click();
        });
    }
    async fillPaymentForm(cardNumber: string, cardName: string, expiryDate: string, cvv: string) {
        await test.step('Filling the payment form', async () => {
            await this.cardNumberInput.fill(cardNumber);
            await this.cardNameInput.fill(cardName);
            await this.expiryDateInput.fill(expiryDate);
            await this.cvvInput.fill(cvv);
            await this.placeOrderButton.click();
        });
    }
}
```

- We need to map the objects in the fixture
```
page.fixtures.ts
import { test as base } from '@playwright/test';

import { LoginPage } from '@/playwright/pages/login';
import { ProductsPage } from '@/playwright/pages/products';
import { HeaderPage } from '@/playwright/pages/header';
import { CartPage } from '@/playwright/pages/cart';
import { CheckoutPage } from '@/playwright/pages/checkout';

// Declare page fixtures
type PageFixture = {
    loginPage: LoginPage;
    productsPage: ProductsPage;
    headerPage: HeaderPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
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
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    }
});
```

- Let's enhance the the workflow

```
import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '@/playwright/pages/login';
import { ProductsPage } from '@pages/products';
import { HeaderPage } from '@pages/header';
import { CartPage } from '@pages/cart';
import { CheckoutPage } from '@pages/checkout';

export class E2E {

    private loginPage: LoginPage;
    private productsPage: ProductsPage;
    private headerPage: HeaderPage;
    private cartPage: CartPage;
    private checkoutPage: CheckoutPage;
    private page: Page;

    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.productsPage = new ProductsPage(page);
        this.headerPage = new HeaderPage(page);
        this.cartPage = new CartPage(page);
        this.checkoutPage = new CheckoutPage(page);
    }

    // Costruct e2e flows using the page objects in one simple class
    async processAPayment(username: string, password: string) {
        await test.step('Process a successful payment', async () => {
            await test.step('Login and wait for products page', async () => {
                await this.loginPage.page.waitForTimeout(500); // Small delay
                await this.loginPage.load();
                await this.loginPage.waitLoad();
                await this.loginPage.submitSignInForm(username, password);
                await this.productsPage.waitLoad();
            });
            await test.step('Adding a product to the cart', async () => {
                await this.productsPage.waitLoad();
                await expect(this.productsPage.page).toHaveURL(this.productsPage.url);
                await this.productsPage.addFirstProductToCart();
            });
            await test.step('Accessing the cart page', async () => {
                await this.headerPage.clickCartLink();
                await expect(this.cartPage.page).toHaveURL(this.cartPage.url);
            });
            await test.step('Clicking on the checkout button', async () => {
                await this.cartPage.clickCheckoutButton();
                await expect(this.checkoutPage.page).toHaveURL(this.checkoutPage.url);
            });
            await test.step('Filling the shipping form', async () => {
                await this.checkoutPage.fillShippingForm('testName', 'test@test.com', 'test address');
            });
            await test.step('Filling the payment form', async () => {
                await this.checkoutPage.fillPaymentForm('1234 1234 1234 1234', 'testNae', '02/30', '123');
            });
        })
    }
}
```

- I need to implement the secrets for the fail payment scenario. So, I will add the secrets to the .env file
```
.env file
SUCCESSFUL_USERNAME="test_user"
SUCCESSFUL_PASSWORD="test_pass"
FAIL_USERNAME="test_failure"
FAIL_PASSWORD="test_pass"
```

- I need to update the types
```
playwright/types/index.ts
declare namespace NodeJS {
  interface ProcessEnv {
    SUCCESSFUL_USERNAME: string;
    SUCCESSFUL_PASSWORD: string;
    FAIL_USERNAME: string;
    FAIL_PASSWORD: string;
  }
}
```

- And then, let's implement the test logic for the negative scenario too :) 

```
import { test, expect } from '@/playwright/fixtures/index.fixtures';
import 'dotenv/config'

const secrets: NodeJS.ProcessEnv = process.env;



test.describe('Payment Workflows', () => {
  test('should process a successful payment', async ({ e2e, checkoutPage }) => {
    await e2e.processAPayment(secrets.SUCCESSFUL_USERNAME, secrets.SUCCESSFUL_PASSWORD);
    // Wait for the order to be placed - Custom logic for this scenario
    await checkoutPage.transactionId.waitFor({ state: 'visible' });
    await expect(checkoutPage.orderPlacedConfirmation).toHaveText('Order placed successfully!');
  });

  test('should process a failed payment', async ({ e2e, checkoutPage }) => {
    await e2e.processAPayment(secrets.FAIL_USERNAME, secrets.FAIL_PASSWORD);
    await checkoutPage.paymentError.waitFor({state: 'visible'})
    await expect(checkoutPage.paymentError).toHaveText('Payment declined. This test user always fails payments.');
  });
});

```


## Before we move on, I want Playwright to start the web site as localhost automatically, before the tests are executed. How to do it? 
- In the playwright.config.ts use the following code snipet: 
```
/* Run your local dev server before starting the tests */
  webServer: {
    command: 'PORT=3001 npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
  },
```

## I would recommend to not use hardcoded test data. Try to always use a data driven framework approach
- Let's create a 'data' folder under 'playwright'
- Create a "payment-information.json" 
```
{
    "shippingInformation": {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "address": "123 Main St, Anytown, USA"
    },
    "paymentInformation": {
        "cardNumber": "1234567890123456",
        "cardName": "John Doe",
        "expiryDate": "01/2025",
        "cvv": "123"
    }
}
```

- Ingest the payment information from that JSON file
```
e2e.ts
import { Page, test, expect } from '@playwright/test';
import { LoginPage } from '@/playwright/pages/login';
import { ProductsPage } from '@pages/products';
import { HeaderPage } from '@pages/header';
import { CartPage } from '@pages/cart';
import { CheckoutPage } from '@pages/checkout';

import paymentInformation from '@/playwright/data/payment-information.json';

export class E2E {

    private loginPage: LoginPage;
    private productsPage: ProductsPage;
    private headerPage: HeaderPage;
    private cartPage: CartPage;
    private checkoutPage: CheckoutPage;
    private page: Page;

    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.productsPage = new ProductsPage(page);
        this.headerPage = new HeaderPage(page);
        this.cartPage = new CartPage(page);
        this.checkoutPage = new CheckoutPage(page);
    }

    // Costruct e2e flows using the page objects in one simple class
    async processAPayment(username: string, password: string) {
        await test.step('Process a payment workflow', async () => {
            await test.step('Login and wait for products page', async () => {
                await this.loginPage.load();
                await this.loginPage.waitLoad();
                await this.loginPage.submitSignInForm(username, password);
                await this.productsPage.waitLoad();
            });
            await test.step('Adding a product to the cart', async () => {
                await this.productsPage.waitLoad();
                await expect(this.productsPage.page).toHaveURL(this.productsPage.url);
                await this.productsPage.addFirstProductToCart();
            });
            await test.step('Accessing the cart page', async () => {
                await this.headerPage.clickCartLink();
                await expect(this.cartPage.page).toHaveURL(this.cartPage.url);
            });
            await test.step('Clicking on the checkout button', async () => {
                await this.cartPage.clickCheckoutButton();
                await expect(this.checkoutPage.page).toHaveURL(this.checkoutPage.url);
            });
            await test.step('Filling the shipping form', async () => {
                await this.checkoutPage.fillShippingForm(paymentInformation.shippingInformation.name, paymentInformation.shippingInformation.email, paymentInformation.shippingInformation.address);
            });
            await test.step('Filling the payment form', async () => {
                await this.checkoutPage.fillPaymentForm(paymentInformation.paymentInformation.cardNumber, paymentInformation.paymentInformation.cardName, paymentInformation.paymentInformation.expiryDate, paymentInformation.paymentInformation.cvv);
            });
        })
    }
}
```
- Let's do the same with the assertions of our tests
- Create a new json under data:
```
assertions.json
{
    "orderPlacedConfirmation": "Order placed successfully!",
    "paymentError": "Payment declined. This test user always fails payments."
}
```

- Implement the assertions from the JSON in the test
```
import { test, expect } from '@/playwright/fixtures/index.fixtures';
import 'dotenv/config'
import assertions from '@/playwright/data/assertions.json';

const secrets: NodeJS.ProcessEnv = process.env;



test.describe('Payment Workflows', () => {
  test('should process a successful payment', async ({ e2e, checkoutPage }) => {
    await e2e.processAPayment(secrets.SUCCESSFUL_USERNAME, secrets.SUCCESSFUL_PASSWORD);
    // Wait for the order to be placed - Custom logic for this scenario
    await checkoutPage.transactionId.waitFor({ state: 'visible' });
    await expect(checkoutPage.orderPlacedConfirmation).toHaveText(assertions.orderPlacedConfirmation);
  });

  test('should process a failed payment', async ({ e2e, checkoutPage }) => {
    await e2e.processAPayment(secrets.FAIL_USERNAME, secrets.FAIL_PASSWORD);
    await checkoutPage.paymentError.waitFor({ state: 'visible' })
    await expect(checkoutPage.paymentError).toHaveText(assertions.paymentError);
  });
});

```


## Implement the logout test, in order to have two test files to implement in CI/CD

- Implement the test in a new test file 'header-functionality.spec.ts'
- I won't use e2e since the workflow will only be used once. There is no need of lots of custom methos that won't be used

```
import { test, expect } from '@/playwright/fixtures/index.fixtures';
import 'dotenv/config'

const secrets: NodeJS.ProcessEnv = process.env;

test.describe('Header Functionality', () => {
    test('should log out successfully', async ({ loginPage, productsPage, headerPage }) => {
        await test.step('Logout', async () => {
            await test.step('Login and wait for products page', async () => {
                await loginPage.load();
                await loginPage.waitLoad();
                await loginPage.submitSignInForm(secrets.SUCCESSFUL_USERNAME, secrets.SUCCESSFUL_PASSWORD);
                await productsPage.page.waitForTimeout(500);
            });
            await test.step('Signing out', async () => {
                await headerPage.clickSignOutBtn();
            })
            await expect(loginPage.page).toHaveURL(loginPage.url);
        });
    });
});

```

- That's it!


## How to run our work on CI? 

Let's first of all create the secrets.

- Go to the repo
- Settings -> Secrets and Variables -> Repository Secrets
- Create one by one your secrets
- Modify the playwright.config.ts for verbose logs in CI
```
 reporter: process.env.CI
    ? [
      ['list'], // Shows test names and status in CI
      ['blob'], // For merging shard reports
      ['github'], // GitHub Actions annotations
    ]
    : 'html',
```
- The create your YML file to get your workflow running:
```
name: Playwright Tests for Udemy Course
on:
  push:
    branches: [ pw-udemy-course-history ]
  pull_request:
    branches: [ pw-udemy-course-history ]
  workflow_dispatch:
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2]
        shardTotal: [2]
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm install -g pnpm && pnpm install
    - name: Install Playwright Browsers
      run: pnpm exec playwright install --with-deps
    - name: Run Playwright tests with shard configuration
      run: pnpm exec playwright test --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }} --reporter=list,blob,github
      env:
          SUCCESSFUL_USERNAME: ${{ secrets.SUCCESSFUL_USERNAME }}
          SUCCESSFUL_PASSWORD: ${{ secrets.SUCCESSFUL_PASSWORD }}
          FAIL_USERNAME: ${{ secrets.FAIL_USERNAME }}
          FAIL_PASSWORD: ${{ secrets.FAIL_PASSWORD }}
    - name: Upload blob report to GitHub Actions Artifacts
      if: ${{ !cancelled() }}
      uses: actions/upload-artifact@v4
      with:
        name: blob-report-${{ matrix.shardIndex }}
        path: blob-report
        retention-days: 1

  merge-reports:
    if: ${{ !cancelled() }}
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm install -g pnpm && pnpm install
    - name: Download blob reports from GitHub Actions Artifacts
      uses: actions/download-artifact@v4
      with:
        path: all-blob-reports
        pattern: blob-report-*
        merge-multiple: true
    - name: Merge into HTML Report
      run: pnpm exec playwright merge-reports --reporter html ./all-blob-reports 
    - name: Upload HTML report
      uses: actions/upload-artifact@v4
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30

```

- Your should see a clean execution :)


## How you can use the AI to ease your work? First approach: Use Playwright MCP Server + your prefered agent 

- First of all, create a ‘rules’ folder and add the ‘playwright-rules.txt’
```
# Playwright Testing Framework Rules & Guidelines

## MANDATORY STRUCTURAL PATTERNS

### 1. Page Object Model (POM) Implementation
- **REQUIREMENT**: All page interactions MUST be encapsulated in Page Object classes
- **LOCATION**: Store all page classes in `/playwright/pages/` directory
- **NAMING**: Use PascalCase with descriptive names ending in "Page" (e.g., `LoginPage`, `CheckoutPage`)
- **STRUCTURE**: Each page class MUST follow this exact pattern:

```typescript
import { Page, Locator, test } from '@playwright/test';

export class [PageName]Page {
    readonly page: Page;
    readonly [elementName]: Locator;
    readonly url: string = '/path';

    constructor(page: Page) {
        this.page = page;
        this.elementName = page.locator('selector').describe('description');
    }

    async load() {
        await test.step('Load [page] page', async () => {
            await this.page.goto(this.url);
        });
    }

    async waitLoad() {
        await test.step('Wait for [page] page to load', async () => {
            await this.[keyElement].waitFor({ state: 'visible' });
        });
    }
}
```

### 2. Fixture Pattern for Dependency Injection
- **REQUIREMENT**: ALL page objects MUST be injected via fixtures, never instantiated directly in tests
- **LOCATION**: Define fixtures in `/playwright/fixtures/page.fixtures.ts`
- **PATTERN**: Each page object must have a corresponding fixture:

```typescript
export const pageFixture = base.extend<PageFixture>({
    [pageName]Page: async ({ page }, use) => {
        await use(new [PageName]Page(page));
    },
});
```

- **IMPORT**: Tests must import from consolidated fixtures: `import { test, expect } from '@/playwright/fixtures/index.fixtures';`

### 3. E2E Workflow Pattern
- **REQUIREMENT**: Complex multi-page workflows MUST use the E2E utility class
- **LOCATION**: `/playwright/utils/e2e.ts`
- **PURPOSE**: Encapsulate complete user journeys that span multiple pages
- **USAGE**: Inject via e2eFixture, access methods like `await e2e.processAPayment(username, password)`

### 4. Test Step Wrapping (MANDATORY)
- **REQUIREMENT**: ALL actions in page objects MUST be wrapped in `test.step()`
- **FORMAT**: `await test.step('Clear description of action', async () => { /* action */ });`
- **BENEFIT**: Provides detailed test execution reporting and debugging

### 5. Data Management Strategy
- **TEST DATA**: Store in `/playwright/data/` directory as JSON files
- **ASSERTIONS**: Use `/playwright/data/assertions.json` for expected text/values
- **SECRETS**: Use environment variables for credentials (NEVER hardcode)
- **PAYMENT INFO**: Centralize in `/playwright/data/payment-information.json`

## FILE ORGANIZATION RULES

### Directory Structure (MANDATORY)
```
playwright/
├── data/                    # JSON files for test data
│   ├── assertions.json      # Expected text values
│   └── payment-information.json
├── fixtures/                # Playwright fixtures
│   ├── index.fixtures.ts    # Consolidated export
│   ├── page.fixtures.ts     # Page object fixtures
│   └── e2e.fixtures.ts      # E2E workflow fixtures
├── pages/                   # Page Object Model classes
│   ├── login.ts
│   ├── products.ts
│   ├── cart.ts
│   └── checkout.ts
├── tests/                   # Test specification files
├── types/                   # TypeScript type definitions
└── utils/                   # Utility classes (E2E workflows)
```

### Naming Conventions
- **Files**: Use kebab-case for test files (e.g., `payment-workflows.spec.ts`)
- **Classes**: PascalCase (e.g., `LoginPage`, `E2E`)
- **Methods**: camelCase with descriptive action names
- **Locators**: camelCase describing the element (e.g., `signInBtn`, `cardNumberInput`)

## LOCATOR STRATEGY

### Required Locator Practices
1. **PREFER**: `data-testid` attributes for reliable element targeting
2. **SECONDARY**: Role-based selectors (`page.getByRole('button', { name: 'Sign In' })`)
3. **AVOID**: CSS selectors based on styling classes
4. **MANDATORY**: Add `.describe()` to all locators for better debugging

### Locator Examples
```typescript
// Preferred (data-testid)
this.cardNumberInput = page.locator('input[data-testid="card-number-input"]');

// Acceptable (role-based)
this.signInBtn = page.getByRole('button', { name: 'Sign In' }).describe('sign in button');

// With description (MANDATORY)
this.errorContainer = page.locator('[data-testid="login-error"]').describe('error container');
```

## TEST ORGANIZATION

### Test File Structure (MANDATORY)
```typescript
import { test, expect } from '@/playwright/fixtures/index.fixtures';
import 'dotenv/config';

const secrets: NodeJS.ProcessEnv = process.env;

test.describe('Feature Name', () => {
    test('should perform specific action', async ({ pageName, anotherPage }) => {
        // Test implementation with proper step wrapping
    });
});
```

### Test Writing Rules
1. **DESCRIBE BLOCKS**: Group related functionality
2. **TEST NAMES**: Use descriptive "should" statements
3. **ENVIRONMENT**: Always import 'dotenv/config' for environment variables
4. **SECRETS**: Access via `process.env` object typed as `NodeJS.ProcessEnv`

## CONFIGURATION REQUIREMENTS

### Playwright Config (playwright.config.ts)
- **BASE URL**: Must be set to `http://localhost:3001`
- **TEST DIR**: Must point to `./playwright/tests`
- **BROWSERS**: Support Chromium, Firefox, WebKit
- **WEB SERVER**: Auto-start with `PORT=3001 npm run dev`
- **REPORTERS**: HTML for local, multiple reporters for CI

### Environment Variables (MANDATORY)
- `SUCCESSFUL_USERNAME`: Valid login credentials
- `SUCCESSFUL_PASSWORD`: Valid login credentials  
- `FAIL_USERNAME`: Credentials that trigger payment failure
- `FAIL_PASSWORD`: Credentials that trigger payment failure

## CODE QUALITY STANDARDS

### TypeScript Requirements
- **TYPES**: Define custom types in `/playwright/types/index.ts`
- **STRICT**: All code must pass TypeScript strict mode
- **IMPORTS**: Use path aliases (`@/playwright/...`, `@pages/...`)

### Error Handling
- **WAITS**: Always use explicit waits (`waitFor({ state: 'visible' })`)
- **ASSERTIONS**: Use Playwright's built-in expect assertions
- **TIMEOUTS**: Rely on Playwright's default timeouts, extend only when necessary


## WORKFLOW PATTERNS

### Authentication Pattern
```typescript
await test.step('Login and wait for products page', async () => {
    await loginPage.load();
    await loginPage.waitLoad();
    await loginPage.submitSignInForm(secrets.SUCCESSFUL_USERNAME, secrets.SUCCESSFUL_PASSWORD);
    await productsPage.waitLoad();
});
```

### Navigation Pattern
```typescript
await test.step('Navigate to cart', async () => {
    await headerPage.clickCartLink();
    await expect(cartPage.page).toHaveURL(cartPage.url);
});
```

### Form Filling Pattern
```typescript
async fillShippingForm(name: string, email: string, address: string) {
    await test.step('Filling the shipping form', async () => {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.addressInput.fill(address);
        await this.continueButton.click();
    });
}
```

## EXISTING APPLICATION CONTEXT

### Current Application Pages & Page Objects
The application contains the following pages with their corresponding Playwright page object status:

**Implemented Page Objects** (in `/playwright/pages/`):
- `LoginPage` (`login.ts`) → `/login` route
- `ProductsPage` (`products.ts`) → `/products` route  
- `CartPage` (`cart.ts`) → `/cart` route
- `CheckoutPage` (`checkout.ts`) → `/checkout` route
- `HeaderPage` (`header.ts`) → Navigation component

**Application Pages Without Page Objects** (in `/app/`):
- **Orders Page** (`/orders`) → Displays order history, similar to cart functionality
- **Root Page** (`/`) → Home/landing page

### Pre-Implementation Analysis (MANDATORY)
Before creating ANY new page object, you MUST:

1. **AUDIT EXISTING**: Review all page objects in `/playwright/pages/` directory
2. **CHECK SIMILARITY**: Identify if similar functionality already exists
   - Example: Orders page functionality overlaps with Cart page (both handle items, totals, navigation)
   - Example: Different checkout steps might reuse existing CheckoutPage methods
3. **EVALUATE REUSE**: Determine if existing page objects can be extended rather than duplicated
4. **ASSESS COMPLETENESS**: Check if existing page objects have missing methods that your test needs

### Functionality Overlap Examples
- **Orders & Cart**: Both display items, prices, totals, and navigation to other pages
- **Login & Checkout**: Both may have form validation and error handling patterns
- **Products & Orders**: Both may have "add to cart" or "buy again" functionality
- **Header Navigation**: Shared across all pages, centralized in HeaderPage

### Implementation Status Assumptions (CRITICAL)
**DO NOT ASSUME** that all page objects are fully implemented:
- Some page objects may be missing essential methods (`load()`, `waitLoad()`)
- Locators might be incomplete or need additional elements
- Page objects may not cover all functionality available on the actual page
- Always verify current implementation before building upon it

**VALIDATION PROCESS**:
1. Read the existing page object file completely
2. Compare against the actual application page requirements
3. Identify missing methods, locators, or functionality
4. Extend existing page objects rather than creating duplicates

## AGENT IMPLEMENTATION GUIDELINES

### When Adding New Tests:
1. **AUDIT FIRST**: Check existing page objects for similar functionality (MANDATORY)
2. **IDENTIFY GAPS**: Determine if new page objects are truly needed or if existing ones can be extended
3. **REUSE PATTERNS**: Extend existing page classes when functionality overlaps
4. **CREATE NEW**: Only create new page objects when functionality is genuinely unique
5. **FIXTURE**: Register new/modified page objects in page.fixtures.ts
6. **DATA**: Add any new test data to appropriate JSON files
7. **WORKFLOW**: Consider if E2E class needs new methods

### When Modifying Existing Tests:
1. **AUDIT EXISTING**: Always check what methods/locators already exist before adding new ones
2. **PRESERVE**: Maintain existing fixture patterns
3. **EXTEND**: Add new locators following naming conventions, avoid duplication
4. **STEP**: Wrap all new actions in test.step()
5. **DESCRIBE**: Add descriptions to new locators

### Error Resolution Priority:
1. Check locator selectors (prefer data-testid)
2. Verify page object fixture registration
3. Ensure proper import paths
4. Validate environment variables
5. Check test.step() wrapping

## CRITICAL SUCCESS FACTORS

### Must-Follow Rules for Agent Success:
1. **ALWAYS** audit existing page objects before creating new ones
2. **NEVER** duplicate functionality that already exists in other page objects
3. **NEVER** instantiate page objects directly in tests
4. **ALWAYS** use fixture injection pattern
5. **NEVER** hardcode test data in test files
6. **ALWAYS** wrap actions in test.step()
7. **NEVER** use unreliable selectors (avoid CSS classes)
8. **ALWAYS** add .describe() to locators
9. **NEVER** skip environment variable setup
10. **ALWAYS** follow the established directory structure

### Quality Checkpoints:
- [ ] Existing page objects audited before creating new ones
- [ ] No duplicate functionality across page objects
- [ ] All page interactions use Page Object Model
- [ ] All page objects are injected via fixtures
- [ ] All actions wrapped in test.step()
- [ ] All locators have descriptions
- [ ] Test data externalized to JSON files
- [ ] Environment variables properly configured
- [ ] TypeScript types defined for custom objects
- [ ] Import paths use aliases correctly

This framework emphasizes maintainability, readability, and scalability. Adherence to these patterns ensures consistent, reliable, and debuggable test automation.


```

- Now, let's integrate the playwright mcp server in your code editor. In my case, it is cursor, but you can use VSCode Copilot as well.
- Accesss to [Playwright MCP](https://github.com/microsoft/playwright-mcp)
- Select cursor and install it
- Let's add an extra power to the MCP Server, let's use the plugin:
https://github.com/microsoft/playwright-mcp/releases
- Download the zip file
- Go to google chrome -> extensions and activate the developer mode
- Click on "Load Unpacked" and select your unzipped folder
- Add the following configuration to your mcp server:
```
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--extension"
      ],
      "env": {
        "PLAYWRIGHT_MCP_EXTENSION_TOKEN": "dmG-3TY-JCnDhEYHQlr9cM16riEZX2acD0IuM-vRP_s"
      }
    }
```
- Run the 'playwright/rules/agent-request-example.txt' in your prefered agent


## Improvement opportunities
- Add describe to the page objects to improve report readability
- Consider before hook if neccesarry after the agent create a new test

## Playwright now have agents.

[Agent docs](https://playwright.dev/docs/test-agents)

