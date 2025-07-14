import { test, expect } from '@playwright/test';

test.describe('Chat Panel', () => {
    test('should switch between chats and display correct messages', async ({ page }) => {
        // Mock the API responses before navigating
        await page.route('/api/messages/line123/chats', route => {
            route.fulfill({
                status: 200,
                body: JSON.stringify(['+1234567890', '+0987654321']),
            });
        });
        await page.route('/api/messages/line123/chats/+1234567890', route => {
            route.fulfill({
                status: 200,
                body: JSON.stringify([{ id: 1, sender: 'other', text: 'Hello from user 1' }]),
            });
        });
        await page.route('/api/messages/line123/chats/+0987654321', route => {
            route.fulfill({
                status: 200,
                body: JSON.stringify([{ id: 2, sender: 'other', text: 'Hey from user 2' }]),
            });
        });

        // Navigate to the chat page
        await page.goto('/chat/line123');

        // Check that the first chat is active by default
        await expect(page.getByText('Hello from user 1')).toBeVisible();
        await expect(page.getByText('Hey from user 2')).not.toBeVisible();

        // Click on the second chat
        await page.getByText('+0987654321').click();

        // Check that the second chat's messages are now visible
        await expect(page.getByText('Hey from user 2')).toBeVisible();
        await expect(page.getByText('Hello from user 1')).not.toBeVisible();
    });
}); 