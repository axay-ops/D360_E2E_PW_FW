/* 
    Class:  Class is blue-print of the Objects.
        *   constructor is not mandatory in a TypeScript class. 
            If you do not provide one, TypeScript (and JavaScript) automatically provides a default constructor for you. 
         
        *  In TypeScript, a class can have only one constructor implementation. 
            But, While you can define multiple overload signatures (to describe different ways to call the constructor), 
            you are strictly limited to one single function body that contains the actual logic.

        * In Typescript, classes have properties, methods, constructors, getters with explict types.

        * 'Default' class; -- Only one 'default export' allowed in one file. It can be either class or method or property.        

        * let, var, are not allowed inside class.
        
        * static  // It is available in class itself. not in objects of class.
                  // static property can be accessed directly on the class name --  classname.property
                    
*/

// 1 - STANDARD WAY of Defining a class (Boilerplate or more lines of code)
       /* DECLARE, then ACCEPT & ASSIGN in constructor*/

class Employee {
    public name: string = 'Dave';   // property with declaration and initialization
    private age: number;            // property with declaration and without Initialized. But initialized inside constructor.
    protected salary: number;
    public readonly city: string;
    
    constructor(name: string, age: number, salary: number, city: string) {
        this.name = name;
        this.age = age;
        this.city = city;
        this.salary = salary;
    }

    data = () => {console.log("Arrow function")};  // Arrow function (Anonymous), Called using var name 'data'.
}

        let e1 = new Employee('Tom', 10, 100, 'NYC');  // Age and Salary are private and protected. Not accessible in e1.
        console.log(e1.name);  // Tom
        console.log(e1.city);  // NYC                  // e1.city = 'DFW';   Only Access, cannot change value as it is readonly
        e1.data();             // Arrow function
       


// 2 - TYPESCRIPT SHORT-HAND   (less Boilerplate code)
        /*  Add access modifiers inside args in Constructor, that's it!  */

        class Employeee {
                constructor (public name: string, private age: number) {}
        }

        let e2 = new Employeee ('Harry', 10);
        console.log(e2.name);                   // Harry.   e2.age is private, not accessible.

/*************************************************************************************************************************/

/* Default values */
        class Employ {
             constructor (public name: string = 'DefaultName') {
        }
    }

        let e3 =  new Employ ();  // So, no need to pass default values


/*************************************************************************************************************************/

/* 
    class without constructor. But, properties have to be either optional/definative assingment.  (if tsconfig -> strictPropertyInitialization: true)
            Optional property with ? 
            Definative property with !
*/
        class User {
            name ?: string;  // Declared but not initialized
            age !: number;   // Declared but not initialized
        }

        const user = new User();
        console.log(user.name, user.age); // undefined undefined

/*************************************************************************************************************************/
    // All possible items in an class
        /* 
            property
            static property
            private static property
            constructor
            method
            static method
            getter

        */
        class Robot {
                // 1. Property
                public id: number = Math.random();

                // 2. Static Property  
                static counter: number = 0;               // It is available in class itself. not in objects of class.

                // 2. private static property
                private static connections: number = 0;

                // 3. Constructor
                constructor(public name: string) {
                    Robot.counter++;
                    Robot.connections++;
                    console.log(Robot.counter);            //increments everytime when new Robot object is instantiated.
                }

                // 4. Method
                greet() {
                    return `Hello, I am ${this.name}`;
                }

                // 5. Getter
                get info() {
                    return `${this.name} (ID: ${this.id})`;
                }

                // 6. static method
                static printCounter () {
                    console.log(Robot.counter);        // static property can be accessed directly on the class name --  classname.property
                    console.log (Robot.connections);   // private static property can be accessed inside class ONLY -- classname.property. NOT outside the class. 
                    return Robot.counter;
                }
        }

        let myRobot = new Robot("ROB");
        console.log(myRobot.name, myRobot.id, myRobot.greet(), myRobot.info);

        let myRobot1 = new Robot("ROB");
        let myRobot2 = new Robot("ROB");
        let myRobot3 = new Robot("ROB");

        console.log(Robot.counter);          // static property can be accessed directly on the class name --  classname.property
        console.log(Robot.printCounter());   // static methods  can be accessed directly on the class name --  classname.methodname
       // console.log(Robot.connections);    // private static property can't be accessed using -- classname.property, outside the class.


/************************************************************************************************** */
        
/* 
            MULIPLE CONSTRUCTOR  (OVERLOAD SIGNATURES, But ONE COMMON IMPLEMENTATION)
            constructor overloading allows you to define several ways to instantiate a class, 
            but you must write a single, flexible implementation that can handle all those different inputs.
*/

        class Point {
            x: number;
            y: number;

        // --- 1. OVERLOAD SIGNATURES (No function bodies) - These tell TypeScript: "These are the valid ways to call 'new Point()'"
            constructor(x: number, y: number);
            constructor(xyString: string);

        // --- 2. THE SINGLE IMPLEMENTATION (One function body) - // This must be compatible with ALL signatures above. 
            constructor(arg1: number | string, arg2?: number) {
                if (typeof arg1 === "string") {
                // Logic for the string overload
                const [xStr, yStr] = arg1.split(",");
                this.x = parseInt(xStr);
                this.y = parseInt(yStr);
                } else {
                // Logic for the number overload
                this.x = arg1;
                this.y = arg2!; // '!' tells TS we know arg2 exists in this branch
                }
            }
            }

        // Valid usages:
            const p1 = new Point(10, 20);      // Uses first signature
            const p2 = new Point("100,200");   // Uses second signature

            // Invalid usage:
            // const p3 = new Point(10);       // ❌ Error: No overload expects 1 number
