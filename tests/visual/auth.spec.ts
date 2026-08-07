import { test, expect } from '@playwright/test';

test.describe('Authentication and Member Portal Routes', () => {
  test('should display login form with brand styling', async ({ page }) => {
    await page.goto('/login');

    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toBeVisible();

    const passwordInput = page.locator('input[name="password"]');
    await expect(passwordInput).toBeVisible();

    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
  });

  test('should display registration form with baptism date requirement for Brothers/Sisters', async ({
    page,
  }) => {
    await page.goto('/register');

    const firstNameInput = page.locator('input[name="firstName"]');
    await expect(firstNameInput).toBeVisible();

    const ecclesiaSelect = page.locator('select[name="ecclesia"]');
    await expect(ecclesiaSelect).toBeVisible();
  });
});
