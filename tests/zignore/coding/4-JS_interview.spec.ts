import { test, expect } from '@playwright/test';


//=========================================================================    

 //     slice(startindx?, endindx?)  
 //     splice(startNumber, deleteCount?)

  let arry1 = ['Apple', 'Banana', 'Cherry', 'Dates', 'Banana'];

    console.log(arry1.slice(0, 1));   // Returns a copy of a section of an array. 
    console.log(arry1.slice(0, -2));    
    console.log(arry1.slice(-1, 1));   
  
    
const arry2 = ['Apple', 'Banana', 'Cherry', 'Dates'];
    const deletedItems = arry2.splice(1, 2); // At index 1, delete 2 items
    console.log(deletedItems);              // Outputs: ['Banana', 'Cherry'] (What was removed)
    console.log(arry2);                    // Outputs: ['Apple', 'Dates'] (The original array is mutated! ⚠️)


const arry3 = ['Apple', 'Banana', 'Cherry', 'Dates'];
    const deletedItems2 = arry3.splice(1, 1, 'Berry1', 'BlueBerry'); // At index 1, delete 1 items, add 2 items
    console.log(deletedItems2);
    console.log(arry3);    

//=========================================================================    

// REVERSE()

const arry4 = ['Apple', 'Banana', 'Cherry', 'Dates'];
 console.log(arry4);   
 console.log(arry4.reverse());
 console.log(arry4);   
 console.log(arry4.reverse());
 console.log(arry4);   

//=========================================================================    

// .CONCAT(arr1, arr7, 'A', 'B')

const arry5 = ['Apple', 'Banana', 'Cherry', 'Dates'];
const arry6 = ['Grape', 'Mango', 'Blueberry', 'Carrot'];
    const newArray5_6 = arry5.concat(arry6); 
    console.log(newArray5_6);  
    console.log(arry5);   // no change to original array

    const newArray = arry5.concat(arry5, arry6, ...arry6, 'FR1', 'FR2');
    console.log(newArray);

//=========================================================================    

// SORT(compareFn()?)

const arry7 = [1, 50, -1, 100.484];
const arry8 = ['Grape', 'mango', 'blueberry', 'Carrot'];
    console.log(arry7.sort((a,b) => a-b));                // number Ascending
    console.log(arry7.sort((a,b) => b-a));                // number descending
    console.log(arry8.sort((a,b) => a.localeCompare(b))); // string ascending
    console.log(arry8.sort((a,b) => b.localeCompare(a))); // string ascending

 /*  Date Sorting Examples */
const dates = [
    new Date('2026-05-17'),
    new Date('2024-01-12'),
    new Date('2026-03-05'),
    new Date('2025-11-20')
    ];
    console.log(dates);  // [2026-05-17T00:00:00.000Z, . . . ]

    const ascendingDates = [...dates].sort((a, b) => a.getTime() - b.getTime());        // .getTime() converts the date to a numeric millisecond timestamp
    console.log('Ascending:', ascendingDates.map(d => d.toISOString().split('T')[0]));  // Output: ['2024-01-12', '2025-11-20', '2026-03-05', '2026-05-17']

    const sortedStrings = [...dates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    console.log(sortedStrings);

    console.log(sortedStrings.map((d) => d.toISOString().split('T')[0]));


test('Split and Sort Manually MM/DD/YYYY HH:mm:ss Timestamps', async () => {
    const logTimestamps = [
        '05/17/2026 14:35:00', // Latest
        '01/12/2024 09:15:30', // Oldest
        '05/17/2026 08:20:00', // Same day, earlier time
        '11/20/2025 23:59:59'
    ];

    const sortedTimestamps = [...logTimestamps].sort((a, b) => {
        
        const parseTimestamp = (ts: string) => {            // Helper fn to convert the a and b to millisecond number
            const [datePart, timePart]      = ts.split(' ');
            const [month, day, year]        = datePart!.split('/').map(Number);
            const [hours, minutes, seconds] = timePart!.split(':').map((item)=> Number(item));
            return new Date(year!, month! - 1, day, hours, minutes, seconds).getTime();  // months are 0-indexed (0 = January), so subtract 1
        };
        return parseTimestamp(a) - parseTimestamp(b);
    });

    console.log(sortedTimestamps);
    
    /* Outputs:
    [
      '01/12/2024 09:15:30',
      '11/20/2025 23:59:59',
      '05/17/2026 08:20:00',
      '05/17/2026 14:35:00'
    ]
    */
});
//=========================================================================    

test('Sort MM/DD/YYYY HH:mm:ss Timestamps Manually', async () => {
    const logTimestamps = [
        '05/17/2026 14:35:00', // Latest
        '01/12/2024 09:15:30', // Oldest
        '05/17/2026 08:20:00', // Same day, earlier time
        '11/20/2025 23:59:59'
    ];

    let sortedTimestamps = [...logTimestamps].sort((a, b) => {

        const helperfn = (ts: string) => {
            const [datepart, timepart] = ts.split(' '); 
            const [month, day, year] = datepart!.split('/').map((item) => Number(item));
            const [hour, min, sec] = timepart!.split(':').map(Number);
            return new Date(year!, month!-1, day, hour, min, sec).getTime();
        }

        return (helperfn(a) - helperfn(b));
    });

    console.log('Manually sorted: '+sortedTimestamps)

});



   

   

