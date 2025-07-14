import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/DeepChat/);
});

test('gets a heading', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'DeepChat' })).toBeVisible();
}); 