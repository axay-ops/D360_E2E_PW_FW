import { test, expect} from '../../fixtures/base.fixture';
import { logviewerPage } from '../../pages/03_logviewerPage';
import { overviewPage } from '../../pages/05_overviewPage';
import * as APPCONSTANTS from '../../data/app-constants';


test.describe('Feature Banners for Hard Reset', async ()=> { 
    
    const chargerName = 'CAM QA C1';
    const chargerId =  'camqac1';
    const depotId =  '6c68d4ff-8946-48e6-9b07-9b41474d978a';

    const chargerDC2 = 'CMS-QA-Auto1-DC2';

    const successResponse = {
        depotId: depotId,
        chargerId: chargerId,
        resetStatus: 'Accepted'
    }

      const errorResponse = {
        depotId: depotId,
        chargerId: chargerId,
        resetStatus: 'Error'
    }

    test('TC01: Verify Success banner for Hard Reset', async ({ AdminhomePage }) => {
        
        expect(await AdminhomePage.isLoggedIn()).toBeTruthy();

        const overviewtab: overviewPage  = await AdminhomePage.navigateOverviewpage();
        expect(await overviewtab.isPageLoaded()).toBeTruthy();

        await overviewtab.openChargerInfoPanel(chargerName);
        await overviewtab.mockAPIResponse(200, successResponse);
        let actualBannerMessage = await overviewtab.clickOnHardReset();
        console.log(`actualBannerMessage (Success): ${actualBannerMessage}`);

    });

    test('TC02: Verify Warning banner for Hard Reset', async ({ AdminhomePage }) => {
        
        expect(await AdminhomePage.isLoggedIn()).toBeTruthy();

        const overviewtab: overviewPage  = await AdminhomePage.navigateOverviewpage();
        expect(await overviewtab.isPageLoaded()).toBeTruthy();

        await overviewtab.openChargerInfoPanel(chargerName);

        await overviewtab.mockAPIResponse(200, successResponse);
        let actualBannerMessage = await overviewtab.clickOnHardReset();
        console.log(`actualBannerMessage (Warning): ${actualBannerMessage}`);
    })

    test('TC03: Verify Error banner for Hard Reset', async ({ AdminhomePage }) => {
        
        expect(await AdminhomePage.isLoggedIn()).toBeTruthy();

        const overviewtab: overviewPage  = await AdminhomePage.navigateOverviewpage();
        expect(await overviewtab.isPageLoaded()).toBeTruthy();

        await overviewtab.openChargerInfoPanel(chargerName);

        await overviewtab.mockAPIResponse(200, errorResponse);
        let actualBannerMessage = await overviewtab.clickOnHardReset();
        console.log(`actualBannerMessage (Error): ${actualBannerMessage}`);

    })

    test('TC04: Verify Error banner for Hard Reset when Network is down', async ({ AdminhomePage }) => {
        
        expect(await AdminhomePage.isLoggedIn()).toBeTruthy();

        const overviewtab: overviewPage  = await AdminhomePage.navigateOverviewpage();
        expect(await overviewtab.isPageLoaded()).toBeTruthy();

        await overviewtab.openChargerInfoPanel(chargerName);
        
        await overviewtab.mockAPIResponseNetworkdown();
        let actualBannerMessage = await overviewtab.clickOnHardReset();
        console.log(`actualBannerMessage (Error): ${actualBannerMessage}`);
    })

     test('TC05: Verify Session in New Tab', async ({ AdminhomePage }) => {
        
        expect(await AdminhomePage.isLoggedIn()).toBeTruthy();

        const overviewtab: overviewPage  = await AdminhomePage.navigateOverviewpage();
        expect(await overviewtab.isPageLoaded()).toBeTruthy();

        await overviewtab.openChargerInfoPanel(chargerDC2);

        // get the context from page, and then start listener on it
        const pageContext =  overviewtab.getPageContext();

        // start listener first, then click, 
        const [newTab, sessionId] = await Promise.all([
            pageContext.waitForEvent('page'),
            overviewtab.clickOnSessionId()
        ]);

        console.log(`session Id: ${sessionId}`);
        await newTab.waitForLoadState('networkidle');
        const newTabUrl = newTab.url();
        console.log(`New tab URL: ${newTabUrl}`);
        expect(newTabUrl).toContain(`${sessionId}`);
        
        // one more tab
        const [newTab2, sessionId2] = await Promise.all([
            pageContext.waitForEvent('page'),
            overviewtab.clickOnSessionId()
        ]);

        console.log(`session Id: ${sessionId2}`);
        await newTab2.waitForLoadState('networkidle');
        const newTabUrl2 = newTab2.url();
        console.log(`New tab URL 2: ${newTabUrl2}`);
        expect(newTabUrl).toContain(`${sessionId}`);
        
        const allPages =  pageContext.pages();
        const allPageUrls =  allPages.map(async (i) => ({
            URL:  i.url(),
            TITLE: await i.title()
        }));

        const allPageDetails = await Promise.all(allPageUrls);
        console.log(`${allPages.length} :::`, allPageDetails);

    })

    test('TC06: Verify Network Monitoring calls', async ({ AdminhomePage }) => {
        
        expect(await AdminhomePage.isLoggedIn()).toBeTruthy();

        const overviewtab: overviewPage  = await AdminhomePage.navigateOverviewpage();
        expect(await overviewtab.isPageLoaded()).toBeTruthy();

        await overviewtab.openChargerInfoPanel(chargerDC2);


        // continue this

    })


})