import { test, expect } from '@playwright/test';

test.describe('CRM Module', () => {
    test('should allow searching for a customer and viewing their profile', async ({ page }) => {
        // Mock the API response for the customer list
        await page.route('/api/customers?search=John', route => {
            route.fulfill({
                status: 200,
                body: JSON.stringify({
                    customers: [{ _id: '1', phone: '09123456789', name: 'John Doe', tags: ['Lead'] }]
                }),
            });
        });

        // Mock the API response for the customer detail
        await page.route('/api/customers/1', route => {
            route.fulfill({
                status: 200,
                body: JSON.stringify({
                    customer: { _id: '1', name: 'John Doe' },
                    messages: [{ text: 'Hi, I would like to know the price.' }]
                }),
            });
        });

        // Navigate to the CRM page
        await page.goto('/crm');

        // Search for a customer
        await page.getByPlaceholder('Search by phone...').fill('John');

        // Check that the customer appears in the list
        await expect(page.getByText('John Doe')).toBeVisible();

        // Click on the customer to view their profile
        await page.getByText('John Doe').click();

        // Check that we are on the correct profile page
        await expect(page).toHaveURL(/.*\/crm\/1/);
        await expect(page.getByText('Hi, I would like to know the price.')).toBeVisible();
    });
}); 