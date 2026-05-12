

/*
 NEW PAGE OR TAB:
 ----------------
    target='_blank' property in DOM will open a new tab. Important!

    const [childpage]= await Promise.all(
        [
            context.waitForEvent('page'),
            page.getByRole('link', {name: 'About Us'}).click()
        ]
    )

*/


import { test, expect, Locator, Page } from '@playwright/test';


test ('Two Tabs or Pages', async ( fixtures ) => {
    
    const ctx = await fixtures.browser.newContext();
    const page1 =  await ctx.newPage();
    await page1.goto('https://orangehrm.com/contact-sales');

    const [page2]= await Promise.all(
        [
            ctx.waitForEvent('page'),
            page1.getByRole('link', {name: 'About Us'}).click()
        ]
    )

    await page2.waitForLoadState();

    let allPages = ctx.pages();
    console.log('No of pages : '+allPages.length);

    await page2.bringToFront();  // bring child window to front

    const page2Title = await page2.title();
    console.log('Page2-Title : '+ page2Title); 

    await page2.close();

    await page1.bringToFront(); // bring main window to front
});


test ('Multiple Tabs or Pages', async ({ browser }) => {
    
    const context = await browser.newContext();
    const page =  await context.newPage();
    await page.goto('https://orangehrm.com/contact-sales');


    let links: Locator[] = [
        page.getByRole('link', {name: 'About Us'}),
        page.getByRole('link', {name: 'Contact Us'}),
        page.getByRole('link', {name: 'Press Release'}),
        page.getByRole('link', {name: 'Become a Partner'})
    ]; 

    let childWindows: Page[] = [];

    // Open all 4 Child windows
    for (let link of links) {
        const [childPage] = await Promise.all([
            context.waitForEvent('page'),
            link.click()
        ])

        await childPage.waitForLoadState();
        childWindows.push(childPage);

    }
    
    console.log('Total Pages: '+context.pages().length);

    for (let i=0; i<childWindows.length; i++) {
        await childWindows[i]?.bringToFront();
        console.log(await childWindows[i]?.title()); 
        await childWindows[i]?.close();
    }

    await page.bringToFront();
    console.log(await page.title());

    console.log('Now, Remaining Pages: '+context.pages().length);

    await page.close();

});

