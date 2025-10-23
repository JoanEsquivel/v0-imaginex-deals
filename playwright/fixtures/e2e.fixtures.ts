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