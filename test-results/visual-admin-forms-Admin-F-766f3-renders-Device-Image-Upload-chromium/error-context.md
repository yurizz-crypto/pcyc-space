# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual\admin-forms.spec.ts >> Admin Forms Auto-Fill and Device Image Upload Specs >> Event Creation Form: Auto-fills URL slug from Title and renders Device Image Upload
- Location: tests\visual\admin-forms.spec.ts:13:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "/admin" until "load"
  navigated to "http://localhost:3000/portal"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e4]:
      - link "PCYC Logo PCYC Space Philippine Christadelphians" [ref=e5] [cursor=pointer]:
        - /url: /
        - img "PCYC Logo" [ref=e7]
        - generic [ref=e8]:
          - generic [ref=e9]: PCYC Space
          - generic [ref=e10]: Philippine Christadelphians
      - navigation [ref=e11]:
        - link "Home" [ref=e12] [cursor=pointer]:
          - /url: /
        - link "About" [ref=e13] [cursor=pointer]:
          - /url: /about
        - link "Events" [ref=e14] [cursor=pointer]:
          - /url: /events
        - link "Merch" [ref=e15] [cursor=pointer]:
          - /url: /merch
      - generic [ref=e16]:
        - link "Merchandise" [ref=e17] [cursor=pointer]:
          - /url: /merch
        - generic [ref=e23]:
          - link "Admin Panel" [ref=e24] [cursor=pointer]:
            - /url: /admin
          - button "Emmanuel Garcia Bro. Emmanuel Cubao Ecclesia" [ref=e28]:
            - generic "Emmanuel Garcia" [ref=e29]: EG
            - generic [ref=e30]:
              - generic [ref=e31]: Bro. Emmanuel
              - generic [ref=e32]: Cubao Ecclesia
  - main [ref=e35]:
    - generic [ref=e36]:
      - generic [ref=e39]:
        - generic [ref=e40]: Member Space
        - heading "Welcome, Bro. Emmanuel!" [level=1] [ref=e41]
        - paragraph [ref=e42]: Manage your camp registrations, view merchandise order receipts, and connect with your ecclesia.
      - generic [ref=e44]:
        - generic [ref=e45]:
          - generic [ref=e46]:
            - generic [ref=e47]: EG
            - generic [ref=e48]:
              - generic [ref=e49]:
                - heading "Bro. Emmanuel Garcia" [level=2] [ref=e50]
                - generic [ref=e51]: BROTHER
                - generic [ref=e52]: ADMIN
              - generic [ref=e53]:
                - generic [ref=e54]: Cubao Ecclesia
                - generic [ref=e59]: •
                - generic [ref=e60]: admin@pcyc.ph
          - generic [ref=e61]:
            - link [ref=e62] [cursor=pointer]:
              - /url: /admin
              - button "Admin CMS" [ref=e63]
            - link [ref=e67] [cursor=pointer]:
              - /url: /events
              - button "Explore Camps" [ref=e68]
        - generic [ref=e72]:
          - generic [ref=e73]:
            - generic [ref=e75]:
              - heading "My Camp Registrations" [level=3] [ref=e76]
              - paragraph [ref=e77]: Events you are currently signed up for.
            - generic [ref=e81]:
              - generic [ref=e85]:
                - heading "No active registrations" [level=3] [ref=e86]
                - paragraph [ref=e87]: You are not registered for any upcoming camp yet. Check out our scheduled events!
              - link [ref=e89] [cursor=pointer]:
                - /url: /events
                - button "Browse Camp Schedules" [ref=e90]
          - generic [ref=e91]:
            - generic [ref=e93]:
              - heading "Merch Orders & Receipts" [level=3] [ref=e94]
              - paragraph [ref=e95]: Status of your fundraising apparel orders.
            - generic [ref=e100]:
              - generic [ref=e105]:
                - heading "No merchandise orders" [level=3] [ref=e106]
                - paragraph [ref=e107]: You haven't placed any merchandise orders yet. Support youth fellowship by ordering official PCYC merch!
              - link [ref=e109] [cursor=pointer]:
                - /url: /merch
                - button "Visit Merch Store" [ref=e110]
  - contentinfo [ref=e111]:
    - generic [ref=e113]:
      - paragraph [ref=e116]: “Remember now thy Creator in the days of thy youth...”
      - generic [ref=e117]: Ecclesiastes 12:1
    - generic [ref=e118]:
      - generic [ref=e119]:
        - generic [ref=e120]:
          - generic [ref=e121]:
            - img "PCYC Logo" [ref=e123]
            - generic [ref=e124]: PCYC Space
          - paragraph [ref=e125]: Philippine Christadelphian Youth Circle is the united fellowship of brothers, sisters, and friends across the Philippine ecclesias. We gather to study the Scriptures, build lifelong friendships, and serve in Christ.
          - generic [ref=e126]: Valencia • Nationwide Ecclesias
        - generic [ref=e131]:
          - heading "Explore" [level=4] [ref=e132]
          - list [ref=e133]:
            - listitem [ref=e134]:
              - link "Home" [ref=e135] [cursor=pointer]:
                - /url: /
            - listitem [ref=e136]:
              - link "About PCYC & History" [ref=e137] [cursor=pointer]:
                - /url: /about
            - listitem [ref=e138]:
              - link "Youth Camps & Events" [ref=e139] [cursor=pointer]:
                - /url: /events
            - listitem [ref=e140]:
              - link "Fundraising Merch" [ref=e141] [cursor=pointer]:
                - /url: /merch
        - generic [ref=e142]:
          - heading "Community" [level=4] [ref=e143]
          - list [ref=e144]:
            - listitem [ref=e145]:
              - link "Join as Member / Friend" [ref=e146] [cursor=pointer]:
                - /url: /register
            - listitem [ref=e147]:
              - link "Member Portal Login" [ref=e148] [cursor=pointer]:
                - /url: /login
            - listitem [ref=e149]:
              - link "contact@pcyc.ph" [ref=e150] [cursor=pointer]:
                - /url: mailto:contact@pcyc.ph
      - generic [ref=e155]:
        - paragraph [ref=e156]: © 2026 Philippine Christadelphian Youth Circle. All rights reserved.
        - paragraph [ref=e157]: Built with for the brotherhood
  - button "Open Next.js Dev Tools" [ref=e165] [cursor=pointer]
  - alert [ref=e169]: Welcome, Bro. Emmanuel!
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Admin Forms Auto-Fill and Device Image Upload Specs', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Authenticate as Admin
  6  |     await page.goto('/login');
  7  |     await page.locator('input[name="email"]').fill('admin@pcyc.ph');
  8  |     await page.locator('input[name="password"]').fill('PcycAdmin2026!');
  9  |     await page.locator('button[type="submit"]').click();
> 10 |     await page.waitForURL('/admin');
     |                ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  11 |   });
  12 | 
  13 |   test('Event Creation Form: Auto-fills URL slug from Title and renders Device Image Upload', async ({
  14 |     page,
  15 |   }) => {
  16 |     await page.goto('/admin/events/new');
  17 | 
  18 |     const titleInput = page.locator('input[name="title"]');
  19 |     const slugInput = page.locator('input[name="slug"]');
  20 |     const imageUploadInput = page.locator('input[name="imageFile"]');
  21 | 
  22 |     await expect(titleInput).toBeVisible();
  23 |     await expect(slugInput).toBeVisible();
  24 |     await expect(imageUploadInput).toBeAttached();
  25 | 
  26 |     // Test Auto-Fill functionality
  27 |     await titleInput.fill('PCYC National Youth Camp 2026');
  28 |     await expect(slugInput).toHaveValue('pcyc-national-youth-camp-2026');
  29 |   });
  30 | 
  31 |   test('Merchandise Creation Form: Auto-fills URL slug from Name and renders Device Image Upload', async ({
  32 |     page,
  33 |   }) => {
  34 |     await page.goto('/admin/merch/new');
  35 | 
  36 |     const nameInput = page.locator('input[name="name"]');
  37 |     const slugInput = page.locator('input[name="slug"]');
  38 |     const imageUploadInput = page.locator('input[name="imageFile"]');
  39 | 
  40 |     await expect(nameInput).toBeVisible();
  41 |     await expect(slugInput).toBeVisible();
  42 |     await expect(imageUploadInput).toBeAttached();
  43 | 
  44 |     // Test Auto-Fill functionality
  45 |     await nameInput.fill('PCYC Embroidered Heavyweight Hoodie');
  46 |     await expect(slugInput).toHaveValue('pcyc-embroidered-heavyweight-hoodie');
  47 |   });
  48 | });
  49 | 
```