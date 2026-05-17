/* you can use page.locator().allTextContents() to get all price strings, 
 convert them to numbers, and 
 then pass them to a summation function using the Spread operator */

 import { test, expect } from '@playwright/test';

    // 1. Define a function using a REST parameter to collect any number of arguments
        function sumPrices(...prices: number[]): number {
            return prices.reduce((total, price) => total + price, 0);

            
        }
  
test('Verify total price matches sum of items', async ({ page }) => {
    await page.goto('https://example.com');

    // 2. Extract all price strings (e.g., ["$10.50", "$20.00"])
        const priceStrings = await page.locator('.price-tag').allTextContents();

    // 3. Convert to numbers (e.g., [10.5, 20.0])
        const priceNumbers = (priceStrings.map(str => parseFloat(str.replace('$', '')))).filter(i=> i>15);

    // 4. Use SPREAD (...) to pass the array into the REST parameter function
        const actualTotal = sumPrices(...priceNumbers);

    // 5. Compare against the "Total" displayed on the page
       // const totalOnPage = parseFloat((await page.textContent('#total-display')).replace('$', ''));
       // expect(actualTotal).toBe(totalOnPage);
});

