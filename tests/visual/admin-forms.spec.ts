import { test, expect } from '@playwright/test';

test.describe('Admin Forms Auto-Fill and Device Image Upload Specs', () => {
  test.beforeEach(async ({ page }) => {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@pcyc.ph';
    const adminPassword = process.env.ADMIN_PASSWORD || 'TestPassword123!';

    // Authenticate as Admin
    await page.goto('/login');
    await page.locator('input[name="email"]').fill(adminEmail);
    await page.locator('input[name="password"]').fill(adminPassword);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/\/portal|\/admin/);
  });

  test('Event Creation Form: Auto-fills URL slug from Title and renders Device Image Upload', async ({
    page,
  }) => {
    await page.goto('/admin/events/new');

    const titleInput = page.locator('input[name="title"]');
    const slugInput = page.locator('input[name="slug"]');
    const imageUploadInput = page.locator('input[name="imageFile"]');

    await expect(titleInput).toBeVisible();
    await expect(slugInput).toBeVisible();
    await expect(imageUploadInput).toBeAttached();

    // Test Auto-Fill functionality
    await titleInput.fill('PCYC National Youth Camp 2026');
    await expect(slugInput).toHaveValue('pcyc-national-youth-camp-2026');
  });

  test('Merchandise Creation Form: Auto-fills URL slug from Name and renders Device Image Upload', async ({
    page,
  }) => {
    await page.goto('/admin/merch/new');

    const nameInput = page.locator('input[name="name"]');
    const slugInput = page.locator('input[name="slug"]');
    const imageUploadInput = page.locator('input[name="imageFile"]');

    await expect(nameInput).toBeVisible();
    await expect(slugInput).toBeVisible();
    await expect(imageUploadInput).toBeAttached();

    // Test Auto-Fill functionality
    await nameInput.fill('PCYC Embroidered Heavyweight Hoodie');
    await expect(slugInput).toHaveValue('pcyc-embroidered-heavyweight-hoodie');
  });
});
