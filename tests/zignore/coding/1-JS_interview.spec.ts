

/* ==================================================
    1.  can JavaScript object hold a function as a property ? Explain with a example.

        Answer:  YES. JS Object can hold a function as a property.   
   ==================================================      */

const myObj = {
    id: 100,
    name:  "Dave",
    isActive: true,
    skills: ['java', 'JS', 'Python'],
    sum : addNum(30, 10), 
    greet: function () {
        console.log("Hello "+this.name);
    } 
}

function addNum(a: number, b: number) {
    return a+b;
}

console.log("SUM : "+myObj.sum); 
myObj.greet(); 

/*  ==================================================
     2.  What is anonymous function:  function without any names
         what are different types: 
    ==================================================  */
    
   const sayBye = function () {  // anonymous fn with variable assigned 
        return "Bye";
    };
 
    () => {                      // Arrow function is also anonymous fn 
        return "Hello";
    };


    setTimeout(()=> {
                    console.log("callback function")
                    }, 
                    5000
              );


/*  ==================================================
    var:  function-scoped or globally-scoped 
            and can be re-declared 
            and it gets updated everywhere.
    
    let :  block-scoped 
            and can be updated, 
            but not re-declared within that scope.
    
    const: cannot be updated
    ==================================================  */

    function varExample() {
        var x = 1;
        if (true) {
            var x=5;  // re-decalred and updated.
            console.log('x inside if = '+x);  // x inside if = 5
        }
        console.log('x outside if = '+x);     // x outside if = 5
    };
    varExample();


    function letExample() {
        let x = 1;
        if (true) {
             let x = 5;    // re-decalred and updated in different block (eg: if block)
            console.log('x inside if = '+x);  // x inside if = 5
        }
        console.log('x outside if = '+x);  // x outside if = 1
    };
    letExample();

    function constExample() {
        const y= 10;
        if (true) {
            // x = 15;  // const cannot be updated
            // const y = 20; 
            console.log('y inside if = '+y); 
        }
        console.log('y outside if = '+y);
    }
    constExample();


    /* ==================================================
    1.  can Array hold a function ? Explain with a example.
        Answer:  YES. 

        NOTE:  IMPLICIT RETURN
        When an arrow function is written on a single line without curly braces { }, 
        it automatically returns the value of the expression following the arrow =>.
        No need to write 'return' keyword. (x) => x=2;
        
        EXPLICIT RETURN
        If you add curly braces { }, the implicit return behavior is disabled. 
        You must manually add the return keyword, or the function will return undefined.

   ==================================================      */
  
   // Array containing functions (implict return)
   const arrayofFunctions: ((num: number) => number)[] = [
         (x) => x+2,
         (x) => x*9,
         (x) => x-1
    ];

      // Array containing functions (explicit return keyword)
   const arrayofFunctions1: ((num: number) => number)[] = [
         (x) => { return x+2 },
         (y) => { return y*9 }
    ];

    let result = 10;
    for (let i of arrayofFunctions1) {
        result = i(result);
        console.log(result);
    }


    


    
    



