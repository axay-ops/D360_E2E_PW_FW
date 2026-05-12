/* 
      frame,  iFrame, frameset
      page.frameLocator("#parent_iframe").frameLocator("#iframe1").click();
      page.frames

*/

import { test, expect, Frame, FrameLocator } from '@playwright/test';

test('Frames Locators', async ({ page }) => {
  await page.goto('https://www.londonfreelance.org/courses/frames/index.html');

  await page.frameLocator('');

  
});


test('Nested Frames Locators', async ({ page }) => {
  await page.goto('https://www.dezlearn.com/nested-iframes-example/');

  let allFrames: Frame[] = page.frames();
        console.log(allFrames.length);

  for (let fr of allFrames) {
        console.log(fr.url());
        console.log(fr.name());
  }

  let parentFrame: FrameLocator = page.frameLocator('#parent_iframe');
  let childFrame: FrameLocator =  parentFrame.frameLocator('#iframe1');

  await page.frameLocator('#parent_iframe')
            .frameLocator('#iframe1')
            .getByRole('button', {name: 'Click Here'})
            .click(); 
  

  // await childFrame.getByRole('button', {name: 'Click Here'}).click(); 

   await parentFrame.getByRole('button', {name: 'Click Here'}).click();
});
