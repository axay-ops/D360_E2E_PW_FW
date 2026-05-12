/* 
    In Browser 'Console' - Java Script Alerts
        1. alert("Hi")
        2. confirm('Are you sure?')
        3. prompt('Enter Username')

      page.on('dailog', async(dialog)=> {
          await dialog.accept();
      })

      Notes:
        dailog -- dailog is a part of the existing page and "blocks" the user from interacting with the page until it is closed. 
        popup  --  Popup is a brand-new Browser Tab or Window.
        By default, if no listerner setup, then PW dismisses the JS Alerts.  
        page.once()  -- listerer stops after first use.

*/

import { test, expect } from '@playwright/test';

test('TC01: page.on("dialog") -- JS Alerts pop ups', async ({ page }) => {
  

  // 1. ALERT 
    page.on('dialog', async(popup) => {
      if (popup.type()  === 'alert') {
              console.log(popup.message());
              await popup.accept();
      }
    })

    

  // 2. CONFIRM 
    page.on('dialog', async(popup) => {
      if (popup.type()  === 'confirm') {
            console.log(popup.message());
            await popup.dismiss();
      }
    })

  // 3. PROMPT 
    page.on('dialog', async(popup) => {
      if (popup.type()  === 'prompt') {
            console.log(popup.message());
            await popup.accept('My Username is ABCD');
      }
    })


  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

  await page.getByRole('button', {name: 'Click for JS Alert'}).click();
  await page.getByRole('button', {name: 'Click for JS Confirm'}).click();
  await page.getByRole('button', {name: 'Click for JS Prompt'}).click();
});


// page.waitForEvent("dailog") listerner stops after first execution.
test('TC02: page.waitForEvent("dailog") -- JS Alerts pop ups', async ({ page }) => {
  
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');


  const [alertpopup] = await Promise.all(
    [
      page.waitForEvent('dialog'),
      await page.getByRole('button', {name: 'Click for JS Alert'}).click()
    ]
  );

  if (['alert', 'confirm', 'prompt'].includes(alertpopup.type()))  {
          alertpopup.accept()
      } 


  await page.getByRole('button', {name: 'Click for JS Alert'}).click();
  await page.getByRole('button', {name: 'Click for JS Confirm'}).click();
  await page.getByRole('button', {name: 'Click for JS Prompt'}).click();
});
