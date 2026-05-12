// 



import { test, expect } from '@playwright/test';

test ('String to Number and Number to String', async ({}) => {

//1 . Convert String to Number
    const str = "29.44";
    const num = Number(str);
    const num1 = parseInt(str);
    const num2 = parseFloat(str);
    console.log("String to Number:"+ num, num1, num2);

//2.  Convert Number to String
    const price = 19.5;
    const str1 = String(price);
    const str2 = price.toString();
    const str3 = price.toFixed(2);  // "19.50"

    console.log("Number to String:"+ str1, str2, str3);


});

