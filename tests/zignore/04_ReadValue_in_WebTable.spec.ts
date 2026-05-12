
import { test, expect } from '@playwright/test';


//  Web Table has single text called Expired. Click a Delete Button in that row
test ('Map() and Filter()', async ({ page }) => {
    
// Using Playwright's built-in locator filter for efficiency
        await page.locator('tr')
        .filter({ hasText: 'Expired' })
        .getByRole('button', { name: 'Delete' })
        .click();

});

