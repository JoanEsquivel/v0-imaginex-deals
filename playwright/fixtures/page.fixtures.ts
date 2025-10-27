import { test as base } from '@playwright/test';
import { LoginPage } from '@/playwright/pages/login';
import { ProductsPage } from '@/playwright/pages/products';
import { HeaderPage } from '@/playwright/pages/header';
import { CartPage } from '@/playwright/pages/cart';
import { CheckoutPage } from '@/playwright/pages/checkout';
import { OrdersPage } from '@/playwright/pages/orders';
// Declare page fixtures
type PageFixture = {
    loginPage: LoginPage;
    productsPage: ProductsPage;
    headerPage: HeaderPage;
    cartPage: CartPage;
    checkoutPage: CheckoutPage;
    ordersPage: OrdersPage;
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
    },
    ordersPage: async ({ page }, use) => {
        await use(new OrdersPage(page));
    }
});