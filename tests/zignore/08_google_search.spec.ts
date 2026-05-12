import { test, expect } from '@playwright/test';

test('Google Search and collect suggestions', async ({ page }) => {
    
    await page.goto('https://google.com');
    await page.getByRole('combobox', { name: 'Search' }).fill('naveen automation labs');
    const allSuggestions = await page.locator('div.mkHrUc li').allInnerTexts();
    console.log(allSuggestions);
    await page.locator('div.mkHrUc li').filter({hasText: 'naveen automation labs github'}).click();
    await page.pause();
});



