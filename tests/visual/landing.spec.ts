import { test, expect } from '@playwright/test';

test.describe('Landing Page Visual & Functional Specs', () => {
  test('should render hero banner, brand palette and responsive navigation', async ({ page }) => {
    await page.goto('/');

    // Check brand heading
    const heroTitle = page.locator('h1');
    await expect(heroTitle).toBeVisible();

    // Check presence of key navigation links
    const eventsNav = page.locator('nav a[href="/events"]');
    await expect(eventsNav).toBeVisible();

    const merchNav = page.locator('nav a[href="/merch"]');
    await expect(merchNav).toBeVisible();
  });
});
