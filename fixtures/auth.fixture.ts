import { test as base, expect} from '@playwright/test';
import { Loginpage } from '../pages/01_loginPage';
import { Homepage } from '../pages/02_homePage';
import { STORAGE_STATE_PATH } from '../playwright.config';


type customFixtures = {
    AdminhomePage: Homepage; 
    nonadminhomePage: Homepage;
}

export const authTest = base.extend<customFixtures>({
    AdminhomePage: async ({browser, baseURL}, use, testInfo) => {

        const context = await browser.newContext(
                { storageState: STORAGE_STATE_PATH('admin')!, 
                  viewport: { width: 1920, height: 1080 }
                },
            );
                    // recordVideo: {dir: testInfo.outputPath('videos')}});
                    
        const mypage = await context.newPage();
        await mypage.goto(baseURL!, {waitUntil: 'networkidle'});

        const homepage = new Homepage (mypage);
        await mypage.waitForLoadState('networkidle');

        // Check if logged in for debugging, but always call use()
        let isLoggedIn = await homepage.isLoggedIn();
        console.log(`AdminhomePage fixture: isLoggedIn = ${isLoggedIn}`);

        // If not logged in, wait a bit and check again
        if (!isLoggedIn) {
            console.warn('Not logged in on first check, retrying...');
            await mypage.waitForTimeout(10000);
            isLoggedIn = await homepage.isLoggedIn();
            console.log(`AdminhomePage fixture: isLoggedIn (retry) = ${isLoggedIn}`);
        }

    
        await use(homepage);

        // Take manual screenshot since we're using a custom context
        const screenshotPath = testInfo.outputPath(`test-finished-1.png`);
        await mypage.screenshot({ path: screenshotPath, fullPage: true });

        await context.close();

        // attach videos manually, since context is created manually (not by PW's page object)
        //     const videoPath = await mypage.video()?.path();
        //     console.log(`Video saved in standard location: ${videoPath}`);
        //         if (videoPath) {
        //         await testInfo.attach('video', {
        //         path: videoPath,
        //         contentType: 'video/webm',
        //     });
        //   }
        },

    nonadminhomePage: async ({browser, baseURL}, use, testInfo) => {
        const context = await browser.newContext(
                {
                    storageState: STORAGE_STATE_PATH('readonly')!,
                    viewport: { width: 1920, height: 1080 }
                });
                
                // recordVideo: {dir: testInfo.outputPath('videos')}});

        const mypage = await context.newPage();
        await mypage.goto(baseURL!, {waitUntil: 'networkidle'});

        const homepage = new Homepage (mypage);
        await mypage.waitForLoadState('networkidle');

        // Check if logged in for debugging, but always call use()
        const isLoggedIn = await homepage.isLoggedIn();
        console.log(`nonadminhomePage fixture: isLoggedIn = ${isLoggedIn}`);

        await use(homepage);

        // Take manual screenshot since we're using a custom context
        const screenshotPath = testInfo.outputPath(`test-finished-1.png`);
        await mypage.screenshot({ path: screenshotPath, fullPage: true });

        await context.close();

        // attach videos manually, since context is created manually (not by PW's page object)
        //     const videoPath = await mypage.video()?.path();
        //     console.log(`Video saved in standard location: ${videoPath}`);
        //         if (videoPath) {
        //         await testInfo.attach('video', {
        //         path: videoPath,
        //         contentType: 'video/webm',
        //     });
        //   }
        }
    }
);

export { expect } ;  
