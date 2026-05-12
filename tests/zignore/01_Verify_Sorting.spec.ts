
import { test, expect, chromium, Browser } from '@playwright/test';

test('verify prices are sorted lowest to highest', async ({ page }) => {
  // 1. Get all price elements and extract text
        const priceStrings = await page.locator('.inventory_item_price').allTextContents();

  // 2. Convert strings (e.g., "$29.99") to numbers (29.99) and remove $ icon.
        const actualPrices = priceStrings.map(p => parseFloat(p.replace('$', '')));

  // 3. Create a sorted copy (ascending)
        const expectedPricesAscending = [...actualPrices].sort((a, b) => a - b);

    // Create a sorted copy (descending)
        const expectedPricesDescending = [...actualPrices].sort((a, b) => b - a);


  // 4. Assertion: Compare actual to expected
        expect(actualPrices).toEqual(expectedPricesAscending);
});


test('String Array Sorting @sort', async ({ page }) => {

        const fruits = ['Banana', 'apple', 'Orange', 'Mango'];
       
        const ascending = [...fruits].sort();   // Use spread [...] to avoid mutating the original array
        console.log(ascending);                 // Output: ["Apple", "Banana", "Mango", "Orange"]
        
        const ascending1 = [...fruits].sort((a, b) => a.localeCompare(b));
        console.log(ascending1); 



        const descending = [...fruits].sort().reverse();
        console.log(descending);                // Output: ["Orange", "Mango", "Banana", "Apple"]

        const descending1 = [...fruits].sort((a, b) => b.localeCompare(a));
        console.log(descending1); 


        
        const items = ['Item 10', 'Item 2', 'Item 1'];

        const wrongSort = [...items].sort((a, b) => a.localeCompare(b));  // Default sort (Lexicographical)
        console.log(wrongSort);  // Output: ["Item 1", "Item 10", "Item 2"]

        const correctSort = [...items].sort((a, b) => 
                                    a.localeCompare(b, undefined, { numeric: true })
                              );

        console.log(correctSort);    // Output: ["Item 1", "Item 2", "Item 10"]

      
        /* BOTH:  case-insensitivity and numeric awareness   */
        const finalSort = [...items].sort((a, b) => 
                        a.localeCompare(b, undefined, { 
                              numeric: true, 
                              sensitivity: 'base' 
                  })
            );

});

test('Number Array Sorting @sort', async ({}) => {

      const numbers: number[] = [10, 3, 12, 9, 14];
      const ascending = [...numbers].sort((a,b)=> a-b);
      console.log(ascending);

      const descending = [...numbers].sort((a,b)=> b-a);
      console.log(descending);
});


test('Array of Objects Sorting @sort', async ({}) => {
      interface Product {
            id: number;
            name: string;
      }

      const products: Product[] = [
                  { id: 1, name: "iPhone 10" },
                  { id: 2, name: "iphone 2" },
                  { id: 3, name: "iPhone 1" }
      ];

      // Sort by the 'name' property
      const sortedProducts = [...products].sort((a, b) => 
                        a.name.localeCompare(b.name, undefined, { 
                        numeric: true, 
                        sensitivity: 'base' 
                  })
      );
      console.log(sortedProducts);
            /* Output:
                  [
                        { id: 3, name: "iPhone 1" },
                        { id: 2, name: "iphone 2" },
                        { id: 1, name: "iPhone 10" }
                  ]
            */

// The "Clean" Extraction Pattern, using map().

            // 1. Your raw API response (Array of Objects)
            const apiResponse = [
                  { id: 101, name: "Zebra Stand" },
                  { id: 102, name: "apple monitor" },
                  { id: 103, name: "Banana Cable" }
            ];

            // 2. Extract just the names into a simple string array from Array of Objects
                   const actualNames = apiResponse.map(item => item.name);                               // Result: ["Zebra Stand", "apple monitor", "Banana Cable"]

                   // const names = (await response.json()).map(i => i.name);   // one liner 
            

            // 3. Create the "Perfectly Sorted" expected list
            const expectedNames = [...actualNames].sort((a, b) => 
                                  a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })  // Result: ["apple monitor", "Banana Cable", "Zebra Stand"]
            );
            

            // 4. Clean Assertion
            expect(actualNames).toEqual(expectedNames);

});



test('Date field Sorting', async ({}) => { 

 // Read Datefields from UI as String Array
      const dateStrings = ['1:14:06 AM 2026-04-23', '2026-04-23 1:14:05 AM' , '2026-04-23 1:13:00 AM' ,'2026-04-23 1:12:06 AM', '2026-04-22 2:14:06 AM'];

 // convert them into date objects
      const dateObjects = [...dateStrings].map(datestr => new Date(datestr));
      console.log(dateObjects);  // 2026-04-23T06:14:06.000Z

            /* The output 2026-04-23T06:14:06.000Z is the ISO 8601 format:
                  T: Separator between the date and time.
                  .000: Milliseconds.
                  Z: Stands for "Zulu" time (UTC)   */

// convert them to interaltime
      const dateObjectstime = dateObjects.map(i => i.getTime());  // Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC.
      console.log(dateObjectstime);  // 2026-04-23T06:14:06.000Z

// then sort them 
      const expectedSortedArray = [...dateObjectstime].sort((a, b)=> b - a);
      console.log(expectedSortedArray);
// Assertion
      expect(dateObjectstime).toEqual(expectedSortedArray); 

});