import { test, expect } from '@playwright/test';

test('TC01: Web Table Pagination', async ({ page }) => {
    
    await page.goto('https://naveenautomationlabs.com/opencart/ui/webtable-pagination.html');

    // await page.getByRole('table', )

    let ispresent = page.getByRole('cell', {name: ''}).isVisible();

});


test('TC02: Calendar picker', async ({ browser, page }) => {

    // Create a fresh context without httpCredentials for external site
    // const context = await browser.newContext({
    //     httpCredentials: undefined
    // });
    //  page = await context.newPage();

    await page.goto('https://seleniumpractise.blogspot.com/2016/08/how-to-handle-calendar-in-selenium.html');
    await page.locator('#datepicker').click();
    let month = await page.locator('span.ui-datepicker-month').innerText();
    let year = await page.locator('span.ui-datepicker-year').innerText();

    let currentMonthYear = `${month?.trim()} ${year?.trim()}`;
    console.log(currentMonthYear);

    let expectedMonthYear = 'December 2026';
    while (true) {
        if (currentMonthYear === expectedMonthYear) {
            await page.getByRole('link', {name: '21', exact: true}).click();
            break;
        }
        else {
            await page.getByTitle('Next').click();
            await page.waitForTimeout(1000);
            month = await page.locator('span.ui-datepicker-month').innerText();
            year = await page.locator('span.ui-datepicker-year').innerText();
            currentMonthYear = `${month?.trim()} ${year?.trim()}`;
            console.log(currentMonthYear);
        
        }

    }

});
