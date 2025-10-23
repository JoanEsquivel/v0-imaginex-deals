import { test, expect } from '@/playwright/fixtures/index.fixtures';
import 'dotenv/config'

const secrets: NodeJS.ProcessEnv = process.env;

test.describe('Payment Workflows', () => {
  test('should process a successful payment', async ({ e2e, headerPage }) => {
    await e2e.processAPayment(secrets.SUCCESSFUL_USERNAME, secrets.SUCCESSFUL_PASSWORD);
    await expect(headerPage.page).toHaveURL(headerPage.url);
  });
  test('should process a failed payment', async ({ e2e, headerPage }) => {
    await e2e.processAPayment(secrets.FAILED_USERNAME, secrets.FAILED_PASSWORD);
    await expect(headerPage.page).toHaveURL(headerPage.url);
  });
})
