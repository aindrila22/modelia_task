import { test, expect } from '@playwright/test';

test.describe('Image Generation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main page with all components', async ({ page }) => {
    // Check main elements are present
    await expect(page.getByRole('heading', { name: 'Modelia' })).toBeVisible();
    await expect(page.getByText('AI-Powered Image Generation')).toBeVisible();
    
    // Check upload area
    await expect(page.getByText('Upload an image')).toBeVisible();
    
    // Check prompt input - use the actual placeholder text
    await expect(page.getByPlaceholder('Describe the image you want to generate...')).toBeVisible();
    
    // Check style selector
    await expect(page.getByRole('combobox')).toBeVisible();
    
    // Check generate button - use the actual button text
    await expect(page.getByRole('button', { name: 'Generate Image' })).toBeVisible();
  });
});