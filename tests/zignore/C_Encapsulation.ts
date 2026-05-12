/* 
    ENCAPSULATION:
        Access modifiers:  (In JS, only # and static.  But in TS, we have public, private, protected, readonly, static)
            * public     -- by default public. keyword 'public' key not needed.
                         -- 

            * private    -- 'private' or #. 
                         -- 'private' is "sugar" provided by TypeScript. 
                            It tells the compiler to complain if you try to access the variable outside the class, 
                            but once the code is compiled to JavaScript, it becomes a regular public property.
                         -- # is a native JavaScript feature (often called "Private Class Fields"). 
                            It uses a # prefix to make the variable truly private at the engine level.   

            * protected  -- 

        plus:
            * readonly   --

            * static     -- doesnt belong to child or object. classname.property.
             

"   INTERVIEW:
            In my Playwright framework, I use encapsulation by defining locators as private properties within a Page Class. 
            I don't let the test scripts touch the locators directly. Instead, I expose public methods like login(user, pass). 
            This ensures that if a CSS selector changes, I only update it in one place, and my tests remain untouched".
*/

class LoginPage {
    loginUN: string = "UN";                        // public    -- CLASS, CHILD-CLASS, INSTANCE-OF-CLASS.
    private loginPWD: string = 'PWD';              // private   -- CLASS. -- NOT ACCESSIBLE OUTSIDE CLASS. 
    #loginBtn: string = 'Btn';                     // private   -- CLASS. -- NOT ACCESSIBLE OUTSIDE CLASS.
    protected loginForgotlink: string = 'Forgot';  // protected -- CLASS, CHILD-CLASS ONLY. NOT ACCESSIBLE OUTSIDE, INSTANCE-OF-CLASS.

    static logout: string = 'Logout';              // static --   CLASS, OUTSIDE CLASS. Using classname.property. NOT ACCESSIBLE via CHILD-CLASS, INSTANCE-OF-CLASS.
 


    // create public methods to give access to private
    expose()  {
        console.log(this.loginUN);
        console.log(this.loginPWD);   //private accessed now
        console.log(this.#loginBtn);  //private accessed now
        console.log(this.loginForgotlink),
        console.log(LoginPage.logout)
    }

}

// Child Class
class HomePage extends LoginPage {
    loginUN: string  = 'UN1';             // public
    loginForgotlink: string = 'Forgot1';  // protected  - only class & child-class.
}

// Instance of Class
let myLoginPage = new LoginPage();
    myLoginPage.loginUN;                   // public


// outside class    
    LoginPage.logout;                       // static - class and outside-class using classname.property.



