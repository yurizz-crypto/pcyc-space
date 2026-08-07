import { test, expect } from '@playwright/test';

test.describe('Ecclesia Directory & Dynamic Platform Metrics Specs', () => {
  test('Landing page displays live Philippine Ecclesias and Youth & Friends metrics', async ({
    page,
  }) => {
    await page.goto('/');

    // Check Hero Metrics with exact text
    const ecclesiaMetric = page.getByText('Philippine Ecclesias', { exact: true });
    await expect(ecclesiaMetric).toBeVisible();

    const youthMetric = page.getByText('Youth & Friends', { exact: true });
    await expect(youthMetric).toBeVisible();

    // Check Footer live location names
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    await expect(footer.getByText('Nationwide Ecclesias')).toBeVisible();
  });

  test('About page renders Philippine Ecclesia Directory from database', async ({ page }) => {
    await page.goto('/about');

    const directoryHeading = page.locator('h2:has-text("Philippine Ecclesia Directory")');
    await expect(directoryHeading).toBeVisible();

    // Check that at least one seeded ecclesia (Cubao Ecclesia) is visible
    const cubaoCard = page.getByRole('heading', { name: 'Cubao Ecclesia' });
    await expect(cubaoCard).toBeVisible();
  });

  test('Registration page populates ecclesia select dropdown with live database options', async ({
    page,
  }) => {
    await page.goto('/register');

    const ecclesiaSelect = page.locator('select[name="ecclesia"]');
    await expect(ecclesiaSelect).toBeVisible();

    // Check option values exist in dropdown
    const cubaoOption = ecclesiaSelect.locator('option:has-text("Cubao Ecclesia")');
    await expect(cubaoOption).toBeAttached();

    const cebuOption = ecclesiaSelect.locator('option:has-text("Cebu Ecclesia")');
    await expect(cebuOption).toBeAttached();
  });
});
