
/* 
    Array Methods

    push, pop, slice, shift, unshift

*/

let mystringArray: string[] = ['Apple', 'Banana', 'Cherry', 'Dates'];

let mynumArray: number [] = [10, 20, 30, 40, 50];
let array1 = [mynumArray];   //      [ [10, 20, 30, 40, 50] ]  2-D Array or Nested Array
let array2 = mynumArray;     //      array2 reference array to mynumArray

let mymixedArray: any[] = ["ABC", 10, true, ""];

// Tuples (simple fixed length)
let myTupleArray:  [number, string, boolean]  = [10, 'ABC', true];  // (simple fixed length)
let myTupleArray1: [number, string, ...boolean[]]  = [10, 'ABC', false, true]; // open-ended Tuple.


let myobjArray_objArray = [
    {id: 1, name: 'java'},
    {id: 2, name: 'ruby'},
    {id: 3, name: 'python', skills: 
        [
            {unit: 1, skillname: 'runtime'},
            {unit: 2, skillname: 'runtime'}
        ]
    }
];

let myobjArray_nestedObject = [
    {id: 1, name: 'ABC'},
    {id: 2, lastname: 'XYZ'},
    {id: 3, fullname: 
        {   fname: 'FN', 
            lastname: 'LN' 
        }
    }
]; 

/*   
  =    Assignment Operator     :  Since 'Banana' is a non-empty string, JavaScript evaluates it as truthy, causing .filter() to keep every single element in the array   
  ==   loose Equality check    :  This compares values for equality after converting both values to a common type (type coercion). It successfully checks if the current fruit string equals 'Banana'.
  ===  Strict Equality check   :  This checks for both value and type equality without performing type coercion.

    "5" == 5   // true
    "5" === 5  // false

*/

// 1. filter () 
    let fruits: string[] = ['Apple', 'Banana', 'Cherry', 'Dates', 'Banana'];
        console.log(fruits.filter((i) => i = 'Banana'));    // ['Apple', 'Banana', 'Cherry', 'Dates', 'Banana']
        console.log(fruits.filter((i) => i == 'Banana'));   // ['Banana', 'Banana']
        console.log(fruits.filter((i) => i === 'Banana'));  // ['Banana', 'Banana']


// 2. find ()     - returns first matching value
//    findLast () - returns last matching value     
    let fruits1: string[] = ['Apple', 'Banana', 'Cherry', 'Dates', 'Banana'];
        console.log(fruits1.find((i) => i === 'Banana'));  
        console.log(fruits1.find((i) => { 
                                    if (i === 'Banana') return true                      
                                   } 
                                 ));
        console.log(fruits1.findLast((i) => i === "Banana"));

    let fruits4 = ['Apple', 'Banana', 'Cherry'];
        let foundIndex = -1;
        const foundValue = fruits4.find((i, idx) => {
            if (i === 'Banana') {
                foundIndex = idx;         // Capture the index right before returning true
                return true;
            }
            return false;
        });
        console.log({ value: foundValue, index: foundIndex })


 // 3. findIndex('callback')     - returns index of first matching value
 //    findLastIndex('callback') - returns index of last matching value

     let fruits2: string[] = ['Apple', 'Banana', 'Cherry', 'Dates', 'Banana'];
        console.log(fruits2.findIndex((i) => i === 'Banana'));      // 1
        console.log(fruits2.findLastIndex((i) => i === 'Banana'));  // 4
        
 // 3. indexOf('value', fromIndex?)     - returns index of first matching value
 //    lastindexOf('value', fromIndex?) - returns index of last matching value

     let fruits3: string[] = ['Apple', 'Banana', 'Cherry', 'Dates', 'Banana'];
        console.log(fruits3.indexOf('Banana'));       // 1
        console.log(fruits3.indexOf('Banana', 2));    // 4
        
        console.log(fruits3.lastIndexOf('Banana'));      // 4
        console.log(fruits3.lastIndexOf('Banana', -2));  // 1



// 4. at()  -- allows negative indexing.
    let fruits6: string[] = ['Apple', 'Banana', 'Cherry', 'Dates', 'Banana'];
        fruits6.at(2);  
        fruits6.at(-2); 

        fruits6[2];                   // bracket notation
        fruits6[fruits6.length - 2];  // bracket notation

// 5.  push('A') -- add element to end of array and returns its new length.
    let fruits7: string[] = ['Apple', 'Banana'];
        console.log(fruits7.push('grape'));           // new length 3
        console.log(fruits7.push('grape', 'carrot')); // new length 4
        console.log(fruits7.push(...fruits6));        // new length 
        console.log(fruits7);  


// 5.  pop() -- removes element from array and returns its new length.
    let arr: string[] = ['A', 'B', 'C', 'D'];
        console.log(arr.pop());   //  D
        console.log(arr);         //  [ 'A', 'B', 'C' ]

// 6.   unshift() -- Inserts new elements at start of array, and returns the new length 
    let arr1 = ['A', 'B', 'C', 'D'];
    let arr2 = ['X',  'Y' , 'Z'];
        console.log(arr1.unshift('a'));       // 5
        console.log(arr1.unshift('F', 'G'));  // 7
        console.log(arr1.unshift(...arr2));   // 10
        console.log(arr1);                    // ['X',  'Y' , 'Z', 'F', 'G', 'a', 'A', 'B', 'C', 'D' ]
        console.log(arr1.sort((a,b) => a.localeCompare(b)));    // ['a', 'A', 'B', 'C', 'D', 'F', 'G', 'X', 'Y', 'Z' ]


// 7.   shift() -- Inserts new elements at start of array, and returns the new length 
    let arr3 = ['A', 'B', 'C', 'D'];
        console.log(arr3.shift());   // A 
        console.log(arr3);          //  [ 'B', 'C', 'D' ]


//8.  map()  -- Returns new array
    const numbers = [1, 2, 3, 4];
    const doubled =  numbers.map(num => num * 2);
    const doubled2 = numbers.map(num => {
                                        return num * 2
                                        });
    console.log(doubled);    // [ 2, 4, 6, 8 ]
    console.log(doubled2);   // [ 2, 4, 6, 8 ]  if curly braces, then 'return' keyword is mandatory.

// 9.  some(), every(), includes()
 let arry = ['Apple', 'Banana', 'Cherry', 'Dates', 'Banana'];

 console.log(arry.includes('Banana'));
 console.log(arry.includes('Apple', 2 ));
