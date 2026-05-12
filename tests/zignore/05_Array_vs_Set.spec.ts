
/* ARRAY TO SET */
const myArray = ['apple', 'banana', 'apple', 'orange'];
    console.log(myArray);
const mySet = new Set(myArray);       // Convert Array to Set
    console.log(mySet);              // Set(3) { 'apple', 'banana', 'orange' }

/* SET TO ARRAY*/
const mySet2 = new Set(['apple', 'banana', 'orange']);
    console.log(mySet);    
const myArray2 = [...mySet];   // Convert Set to Array  using spread operator [...]
    console.log(myArray2);


 /* */
 const arr = ['Home ', ' Settings', 'Home ', '']  ; 

 const cleanArr = [...new Set(arr)].filter(i => i !== '').map(i => i.trim()).sort((a, b) => b.localeCompare(a));
console.log(cleanArr);