import { test, expect} from '../../fixtures/base.fixture';
import { compiled_getChargersAPIschema } from '../../utils/dataLoader';
import { getAccessTokenFromStorageState, getApiBaseUrl, getDepotList } from '../../utils/apiAuthHelper';
import { STORAGE_STATE_PATH } from '../../playwright.config';
import { JSONPath } from 'jsonpath-plus';
import { createMockServer, mockHandlers } from '../../utils/mswSetup';


test.describe('API Mocking using Mock Service Worker: cm-charger-dashboard API', async () => {
        let accessToken: string;
        let apiBaseUrl: string;
        let apiFullUrl: string;
        let subtenant: string;
        const depotId: string = '6c68d4ff-8946-48e6-9b07-9b41474d978a';
        const chargerId: string = 'WBAD39G261'; // 'WBAD39G261'  camqaac4;

    test.beforeAll(async ({}, testInfo) => {
        
        accessToken = getAccessTokenFromStorageState(STORAGE_STATE_PATH('admin')); 
        subtenant = getDepotList(STORAGE_STATE_PATH('admin'));
        apiBaseUrl = getApiBaseUrl(testInfo); 
        apiFullUrl = apiBaseUrl.concat('/cm-charger-dashboard/v1/').concat(`${depotId}/chargers/${chargerId}`);

        console.log(`API Base URL : ${apiBaseUrl}`);
        console.log(`API Full URL : ${apiFullUrl}`);
        console.log(`Access Token extracted : ${accessToken.substring(0, 20)}...`);
        console.log(`Depot List : ${subtenant}`);
    });

   /*
    Note: Using MSW (Mock Service Worker) to intercept and mock API responses
          MSW intercepts requests at the network level before they reach the server

          Option 2: Each test creates its own server instance for full isolation
   */
    test ('TC01: API Mocking using MSW - 400 Bad Request', {tag: ['@smoke']}, async ({request}) => {

        // Create a fresh MSW server instance for this test
        const mockServer = createMockServer();

        // Setup MSW to mock the API with 400 Bad Request
        mockServer.use(
            mockHandlers.badRequest(apiFullUrl, 'Invalid request parameters')
        );

        // Start the mock server
        mockServer.listen({ onUnhandledRequest: 'bypass' });

        console.log('🎭 MSW Mock Server started for TC01');

        // Make the API call - will be intercepted by MSW
        const response = await request.get(`${apiFullUrl}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'subtenant': subtenant
            }
        });

        console.log('\n === 0. RAW RESPONSE (mocked by MSW)');
        console.log(`Status: ${response.status()}`);
        console.log(await response.json());
 
        // Assertions for 400 response
        expect(response.ok()).toBeFalsy();
        expect(response.status()).toBe(400);

        console.log('✅ API response successfully mocked to 400 status');

        // Stop the mock server
        mockServer.close();

    })


})