import { mergeTests } from '@playwright/test';
import { pageFixture } from '@/playwright/fixtures/page.fixtures';

export const test = mergeTests(pageFixture);

export { expect, request } from '@playwright/test';