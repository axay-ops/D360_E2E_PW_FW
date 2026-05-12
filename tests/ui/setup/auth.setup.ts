import { test as setup, expect, Page } from '@playwright/test';
import { STORAGE_STATE_PATH } from '../../../playwright.config';
import { Loginpage } from '../../../pages/01_loginPage';
import { Homepage } from '../../../pages/02_homePage';
import fs from 'fs';


setup ('Authenticate as Admin User', async ({page, baseURL}) => {

    const mypage = new Loginpage (page);
    await mypage.navigatetoLoginPage(baseURL);
    const homepage:Homepage = await mypage.validLogin(process.env.D360_ADMIN_USER!,  process.env.D360_ADMIN_PASSWORD!);
    await homepage.waitForLoadState('networkidle');
    expect(await homepage.isLoggedIn()).toBeTruthy();
    await homepage.saveSessionState('admin');
});


setup ('Authenticate as Read Only User', async ({page, baseURL}) => {

    const mypage = new Loginpage (page);
    await mypage.navigatetoLoginPage(baseURL);
    const homepage:Homepage = await mypage.validLogin(process.env.D360_READONLY_USER!,  process.env.D360_READONLY_PASSWORD!);
    await homepage.waitForLoadState('networkidle');
    expect(await homepage.isLoggedIn()).toBeTruthy();
    await homepage.saveSessionState('readonly');

});


// // Debug: Print all cookies before saving
    //         const cookies = await page.context().cookies();
    //         console.log('=== All cookies after login ===');
    //         cookies.forEach(cookie => {
    //             console.log(`${cookie.name}: ${cookie.value.substring(0, 20)}... (domain: ${cookie.domain})`);
    //         });
    //         console.log(`Total cookies: ${cookies.length}`);

//     // Debug: Check localStorage for auth tokens
        //     const mylocalStorage = await page.evaluate(() => {
        //         const items: any = {};
        //         for (let i = 0; i < window.localStorage.length; i++) {
        //             const key = window.localStorage.key(i);
        //             if (key) {
        //                 const value = window.localStorage.getItem(key);
        //                 items[key] = value ? value.substring(0, 50) + '...' : null;
        //             }
        //         }
        //         return items;
        //     });
        //     console.log('=== localStorage after login ===');
        //     console.log(JSON.stringify(mylocalStorage, null, 2));



