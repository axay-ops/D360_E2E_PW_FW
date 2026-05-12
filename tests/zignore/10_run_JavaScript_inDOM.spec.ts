
/*
    page.evaluate() 

*/


import { test, expect } from '@playwright/test';

test('Run JavaScript to get the * ', async ({ page }) => {
    
    await page.goto('https://naveenautomationlabs.com/opencart/index.php?route=account/register');

    let content = await page.evaluate(() => {
    return window.getComputedStyle(
                    document.querySelector('label[for=input-firstname]')!, '::before')
                    .getPropertyValue('content');

    });

    console.log("content :   " + content)
    let color = await page.evaluate(() => {
    return window.getComputedStyle(
                    document.querySelector('label[for=input-firstname]')!, '::before')
                    .getPropertyValue('color');


    });

    console.log("Color:   " + color);


    page.on('dialog', async (mydailog)=> {
        await page.waitForTimeout(5000);
        await mydailog.accept();
    })

    await page.evaluate(()=> {
        alert('Hello from the browser!');
    })

    //await page.pause();


});





