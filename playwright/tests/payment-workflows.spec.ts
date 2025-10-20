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
