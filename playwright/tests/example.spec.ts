import { test, expect } from '@/playwright/fixtures/index.fixtures';

test.describe('Login Workflow', () => {
  test('should login with valid credentials', async ({ loginPage }) => {
    await loginPage.load();
    await loginPage.waitLoad();
    await loginPage.submitSignInForm('test_user', 'test_pass');
    await expect(loginPage.page).toHaveURL('/products');
  });
})
