

import { test, expect } from '@playwright/test';

/*    How to Make an Array Truly Immutable

    splice(), push(), or pop()  mutates the original array
    Option 1 :  ReadonlyArray 
    Option 2 :  Object.freeze
    Option 3 :  As Const

*/
// ==============================================================================

const secureFruits:  readonly string[] = ['Apple', 'Banana'];
const secureFruits1 : ReadonlyArray<string> = ['Apple', 'Banana'];


    secureFruits.splice(1, 1);  // ❌ TypeScript Compiler Error: Property 'splice' does not exist on type 'readonly string[]'.
    
    
// ==============================================================================

const frozenFruits = Object.freeze(['Apple', 'Banana']);
    frozenFruits.splice(1, 1);   // ❌ Runtime Error in Strict Mode / Silently ignored in Non-Strict Mode
    frozenFruits.slice();        //  SLICE works as it doesnt mutate the original array

// ==============================================================================

const appConfig = ['Staging', 'AdminPortal', 443] as const;  // 1. Declare the array with the "as const" assertion

    appConfig.splice(1, 1);          // 2. Try to mutate it (TypeScript blocks these instantly!)
    appConfig[0] = 'Production';    // ❌ Error: Cannot assign to '0' because it is a read-only property.

    console.log(appConfig[1]); // Outputs: 'AdminPortal'
    expect(appConfig[2]).toBe(443);



