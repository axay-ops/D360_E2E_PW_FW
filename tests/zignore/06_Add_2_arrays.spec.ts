/* Add Two Arrays */

        let arr1 = [1, 2];
        let arr2 = [3, 4];
        let arr3 = [5, 6];

        const combined1 = [...arr1, ...arr2, ...arr3];      //  [ 1, 2, 3, 4, 5, 6 ]
        const combined2 =  arr1.concat(arr2).concat(arr3);  //  [ 1, 2, 3, 4, 5, 6 ]

/* Adding an Entire Array into Another */
        let arrA = [10, 11];   // [ 10, 11 ]
        let arrB = [12, 13];   // [ 12, 13 ]

        arrA.push(...arrB);    // [ 10, 11, 12, 13 ]


/* Merge them Arrays, remove duplicates, and sort */  
const headers = ['a', 'b', 'c'];
const footers = ['x', 'y', 'z'];
const allUniqueSorted = [...new Set([...headers, ...footers])]
                        .map(text => text.trim())
                        .sort((a, b) => a.localeCompare(b));


/*  If Arrays have Objects in it then -- SET will not help to remove duplicates */

const objArrA = [
    {id: 1, name: 'PW'},
    {id: 2, name: 'TS'},
    {id: 3, name: 'JS'}
];

const objArrB = [
    {id: 3, name: 'JS'},
    {id: 4, name: 'TS'},
    {id: 5, name: 'JS'}
];

/* OPTION 1:  findIndex() approach.
    The findIndex always returns the index of the very first match it finds. 
    If the current index is higher than that first match, 
    it means you have stumbled upon a duplicate, 
    and .filter returns false to exclude it.
*/
    const combined = [...objArrA, ...objArrB];
    const uniqueById = combined.filter((item, index, self) =>
                                        index === self.findIndex((t) => 
                                        t.id === item.id)
    );

/* OPTION 2: The TypeScript Map Approach 
    combined.map(item => [item.id, item]):  This transforms your objects into an array of "pairs" like [ [1, {obj}], [2, {obj}] ].
    new Map(...):                           The Map constructor takes those pairs. If it sees id: 3 twice, it just updates the value for key 3.
    .values():                              This extracts just the objects, ignoring the keys.
    [...]:                                  Spreads those values back into a standard array.*/
    const combinedAB = [...objArrA, ...objArrB];
    const uniqueByIdAB =  [...(combinedAB.map(item => [item.id, item])).values()]