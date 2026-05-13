import { test, expect } from '@playwright/test';

test('Mouse Keys', async ({ page }) => {
    
    await page.goto('https://swisnl.github.io/jQuery-contextMenu/demo.html');
    

    // right click
    await page.getByText('right click me', {exact: true}).click({button: 'right'});
    
    // on hover
    await page.getByText('add on').hover();

});


test('Drag and Drop', async ({ page }) => {
    
    await page.goto('https://swisnl.github.io/jQuery-contextMenu/demo.html');
    
        const sourceLocator = page.locator('#source');

        const targetLocator = page.locator('#target');

        await sourceLocator.dragTo(targetLocator);

});


test('Sub Menu Handling', async ({ page }) => {
    
    await page.goto('https://www.spicejet.com/');

    
    // on hover
    await page.getByText('Travel Policies', {exact: true}).hover();

    await page.getByText('Airlines').waitFor({state: 'visible'});

    await page.getByText('Airlines').click();


});

test ('Keyboard Tab Sequence (Accessibilty Test)', async ({ page }) => {
    
    await page.goto('https://naveenautomationlabs.com/opencart/index.php?route=account/register');

    const fn =  page.getByRole('textbox', {name: 'First Name'});

                await fn.fill('First Name');
                
                await fn.press('Tab');
                await page.keyboard.type('Last Name');

                await page.keyboard.press('Tab');
                await page.keyboard.type('email@email.com');

                await page.keyboard.press('Tab');
                await page.keyboard.type('1234567890');

                await page.keyboard.press('Tab');
                await page.keyboard.type('Abcd@1234');

                await page.keyboard.press('Tab');
                await page.keyboard.type('Abcd@1234');
                
                await page.keyboard.press('Tab');

                await page.keyboard.press('ArrowRight');

                await page.keyboard.press('Tab');
                await page.keyboard.press('Tab');

                await page.keyboard.press('Space');

                await page.keyboard.press('Tab');

                await page.keyboard.press('Enter');

                
});

/*  Press Shift+Tab
------------------------

    await page.keyboard.press('Shift+Tab');
 or
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');


*/