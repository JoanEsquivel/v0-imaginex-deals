import { mergeTests } from '@playwright/test';
import { pageFixtures } from '@/playwright/fixtures/page.fixtures';
import { e2eFixture } from '@/playwright/fixtures/e2e.fixtures';

export const test = mergeTests(pageFixtures, e2eFixture);

export { expect, request } from '@playwright/test';