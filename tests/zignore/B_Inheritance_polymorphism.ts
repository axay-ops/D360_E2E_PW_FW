/* 
    INHERITANCE
    ****************************
        * Inheritance something from parent. 
            Ex: Class inherits another class

        * Multiple Inheritance in class NOT ALLOWED. (its allowed in Interfaces)
            A class cannot inheritance from two parent classes directly. But, Parent, Grandparent allowed.
            Ex:  class vw extends Car, Truck {} -- NOT ALLOWED
            DIAMOND PROBLEM. One class cannot get extended by multiple classes.


        * keywords:  
            extends -- for creating child class extending parent class.
            super   -- first line in child constructor. To call parent's constructor.
            this    -- refers to local properties of the instance of the class.

        * Inheritance allows a class to derive properties and methods from another class, promoting code reuse
        * Interview Answer: Since playwright provides native fixtures, we dont really have to create class inheritance
                          But, sometimes we create base page with headers and footers, and all other pages extends it.   

        
    PLOYMORPHISM:
    ****************************
    A. METHOD OVERRIDING:
        A child class has same exact method-name and its signatures defined as parent's methods.
        Child "overrides" parents' method.

    B. METHOD OVERLOADING:  ALLOWED, but it works in different way.
       A single method can be called in different ways, each with different params or count. having single implementation.
       i.e.  OVERLOADING SIGNATURES, But, SINGLE IMPLEMENTATION.
*/

    class Car {       
        start() {}
        stop() {}
    }

    class Truck {
        start() {}
        stop() {}
    }

    class bmw extends Car {

        // METHOD OVERRIDING:  Child class is overridden parents' method.  // override keyword not mandatory. 
            override start(): void {
                    console.log("bmw:  start");
            }
        
        // METHOD OVERLOADING:  NOT ALLOWED  in this way. 
            /* stop(name:number): void {
                console.log("bmw:  stop");
            } */

        // METHOD OVERLOADING: ALLOWED, with same name but different params, having one single implementation.
            headlight(arg1: string): boolean;
            headlight(arg1: number): boolean;
            headlight(arg: string | number): boolean {
                return true;
            }
    }

    // 'super' and 'this' keywords.
    class diamler extends Truck {

        name: string;
        wheels: number;

        constructor (name: string, wheels: number) {
            super();
            this.name = name;
            this.wheels = wheels;
        }

        start(): void {};
        stop(): void {};

    }

