//  map, filter, reduce


import { test, expect } from '@playwright/test';

/*  You receive an array of user objects from an API. 
    Filter out users who are inactive and map their names into a single string array. 
    
*/

test ('Map() and Filter()', async ({ request }) => {

    interface User { 
        id: number; 
        name: string; 
        isActive: boolean
    };

    const users: User[] = await request.get('/api/users').then(res => res.json());

    const activeUserNames = users
                        .filter(user => user.isActive)  // Keep only active ones
                        .map(user => user.name);        // Extract just the names

});


/* 
    Given a list of product prices on a page (e.g., $(".price")),  
    write a snippet to extract them as numbers and find all prices greater than $100. 
*/

test ('Get Prices greater than 100', async ({page}) => {

    // const getAllPrices = await page.locator(".price-tags").allInnerTexts(); // $10.3

    const getAllPrices1 = ["$10.4", "$100.5", "$400.222", "$0.99"];
    const AllPricesNumbers = getAllPrices1.map(i => parseFloat(i.replace('$', ''))).filter(e => e>100); // 10.3 as number
    console.log(AllPricesNumbers);

    // OPTION 2:

        const priceLocators = await page.locator('.price').all();

        const allPrices = await Promise.all(
        priceLocators.map(async (el) => {
            const text = await el.innerText();
            return Number(text.replace('$', ''));
        })
        );
        const expensiveItems = allPrices.filter(price => price > 100);


});






