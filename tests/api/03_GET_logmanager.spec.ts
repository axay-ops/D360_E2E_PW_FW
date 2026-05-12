import { test, expect} from '../../fixtures/base.fixture';
import { compiled_getLogmanagerApiSchema } from '../../utils/dataLoader';
import { getAccessTokenFromStorageState, getApiBaseUrl, getDepotList } from '../../utils/apiAuthHelper';
import { STORAGE_STATE_PATH } from '../../playwright.config';
import { JSONPath } from 'jsonpath-plus';


test.describe('CMS Log Manager APIs',
        {annotation: {
            type: 'Feature', description: 'This API feeds Log Viewer' },
        tag: ['@api','@chargersAPI']},
        async () => {

        let accessToken: string;
        let apiBaseUrl: string;
        let apiLogmanager: string;
        let subtenant: string;
        const depotId: string = '6c68d4ff-8946-48e6-9b07-9b41474d978a';
        const chargerId: string = 'camqaac4';    // 'WBAD39G261'  camqaac4;
        const messageType: string = 'BootNotification,StartTransaction'

        // {{app_url}}/logmanager/search?depotId=6c68d4ff-8946-48e6-9b07-9b41474d978a&page=0&size=50


        test.beforeAll(async ({}, testInfo) => {
        
            accessToken = getAccessTokenFromStorageState(STORAGE_STATE_PATH('admin')); 
            subtenant = getDepotList(STORAGE_STATE_PATH('admin'));
            apiBaseUrl = getApiBaseUrl(testInfo); 
            apiLogmanager = apiBaseUrl.concat('/logmanager/search?');
            console.log(`API Full URL : ${apiLogmanager}`);
            console.log(`Access Token extracted : ${accessToken.substring(0, 20)}...`);
            console.log(`Depot List : ${subtenant}`);
        });

   
        test ('TC01: Validate Response contains correct DepotIds and size', {tag: ['@smoke']}, async ({request}) => {

            const response = await request.get(`${apiLogmanager}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'subtenant': subtenant
                },
                params: {
                    'depotId': depotId,
                    'page': 0,
                    'size': 50
                }
            });

            expect(response.ok()).toBeTruthy();
            expect(response.status()).toBe(200);

            const responseObj = await response.json();
            console.log(JSON.stringify(responseObj, null, 2))

            let isSchemaValid = compiled_getLogmanagerApiSchema(responseObj);
            expect(isSchemaValid).toBeTruthy();
            console.log('Log Manager API response has a valid schema');

            const allIds: any[] = JSONPath({path: '$._embedded.logMessageList[*].id', json: responseObj}); 
            expect(allIds.length).toBe(50); 
            console.log('Response contains 50 results'); 

            const pageSize: any[] = JSONPath({path: '$.page.size', json: responseObj});
            expect(pageSize[0]).toBe(50);
            console.log('Page Size in the response is 50'); 

             const depotIdfilter: any[] =  JSONPath({path: `$._embedded.logMessageList[?(@.depotId == '${depotId}')]`, json: responseObj});
            expect(depotIdfilter.length).toBe(50); 
            console.log('All 50 Results belongs to same DepotId');
        });


        test ('TC02: Verify Response is sorted in desc order by updateDate', {tag: ['@smoke']}, async ({request}) => {

            const response = await request.get(`${apiLogmanager}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'subtenant': subtenant
                },
                params: {
                    'depotId': depotId,
                    'page': 0,
                    'size': 50
                }
            });

            expect(response.ok()).toBeTruthy();
            expect(response.status()).toBe(200);

            const responseObj = await response.json();
            console.log(JSON.stringify(responseObj, null, 2))

            let isSchemaValid = compiled_getLogmanagerApiSchema(responseObj);
            expect(isSchemaValid).toBeTruthy();
            console.log('Log Manager API response has a valid schema');

            const updatedDates: string[] = await JSONPath({path:'$._embedded.logMessageList[*].updatedDate', json: responseObj}); 

            for (let i=0; i<updatedDates.length-1; i++) {
                const currentDate = new Date(updatedDates[i]!); 
                const nextDate = new Date(updatedDates[i+1]!);

                console.log(`${updatedDates[i]} ::: ${updatedDates[i+1]}`);  //  2026-05-11T20:08:10.224Z
                console.log(`${currentDate} ::: ${nextDate}`);               //  Mon May 11 2026 15:08:10 GMT-0500 (Central Daylight Time)
                expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime()); // number representing the total ms that have passed since the Unix Epoch (January 1, 1970, 00:00:00)  
            }

            console.log('Response is sorted in descending order by updatedDate'); 
        
        })


        test ('TC03: Verify Date Range filter', {tag: ['@smoke']}, async ({request}) => {

            const response = await request.get(`${apiLogmanager}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'subtenant': subtenant
                },
                params: {
                    'depotId': depotId,
                    'page': 0,
                    'size': 50,
                    'dateFrom': '2026-04-01T00:00:00.000Z',
                    'dateTo'  : '2026-04-15T23:59:59.999Z'
                }
            });

            expect(response.ok()).toBeTruthy();
            expect(response.status()).toBe(200);

            const responseObj = await response.json();
            console.log(JSON.stringify(responseObj, null, 2))

            let isSchemaValid = compiled_getLogmanagerApiSchema(responseObj);
            expect(isSchemaValid).toBeTruthy();
            console.log('Log Manager API response has a valid schema');

            
            
            const updatedDates: string[] = JSONPath({path: '$._embedded.logMessageList[*].updatedDate', json: responseObj}); 

            for (let updateddate of updatedDates) {

                const datefrom = new Date('2026-04-01T00:00:00.000Z');
                const dateTo = new Date('2026-04-15T23:59:59.999Z');

                const unixdate = new Date(updateddate);
                expect(unixdate.getTime()).toBeLessThanOrEqual(dateTo.getTime()); 
                expect(unixdate.getTime()).toBeGreaterThanOrEqual(datefrom.getTime()); 

            }

            console.log('Date range filter is working fine');

        })


        test ('TC04: Verify MessageType filter', {tag: ['@smoke']}, async ({request}) => {

            const response = await request.get(`${apiLogmanager}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'subtenant': subtenant
                },
                params: {
                    'depotId': depotId,
                    'page': 0,
                    'size': 50,
                    'dateFrom': '2026-04-01T00:00:00.000Z',
                    'dateTo'  : '2026-04-30T23:59:59.999Z',
                    'messageType': messageType
                }
            });

            expect(response.ok()).toBeTruthy();
            expect(response.status()).toBe(200);

            const responseObj = await response.json();
            console.log(JSON.stringify(responseObj, null, 2))

            let isSchemaValid = compiled_getLogmanagerApiSchema(responseObj);
            expect(isSchemaValid).toBeTruthy();
            console.log('Log Manager API response has a valid schema');

            
            const ActulmessageTypes: string[] = await JSONPath({path: '$._embedded.logMessageList[*].messageType', json: responseObj}); 
            const ExpectedMessageTypes: string[] = messageType.split(',');

            for (let msgtype of ActulmessageTypes) {

                expect(ExpectedMessageTypes).toContain(msgtype);
            }

            console.log('MessageType filter is working fine'); 
        })


        // 

        test ('TC05: Verify MessageId in Request and Response is same', {tag: ['@smoke']}, async ({request}) => {

            const response = await request.get(`${apiLogmanager}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'subtenant': subtenant
                },
                params: {
                    'depotId': depotId,
                    'page': 0,
                    'size': 50,
                    'dateFrom': '2026-04-01T00:00:00.000Z',
                    'dateTo'  : '2026-04-30T23:59:59.999Z',
                    'messageType': messageType
                }
            });

            expect(response.ok()).toBeTruthy();
            expect(response.status()).toBe(200);

            const responseObj = await response.json();
            //console.log(JSON.stringify(responseObj, null, 2))

            let isSchemaValid = compiled_getLogmanagerApiSchema(responseObj);
            expect(isSchemaValid).toBeTruthy();
            console.log('Log Manager API response has a valid schema');

            
            const logMessageList: any[] = JSONPath({path: '$._embedded.logMessageList[*]', json: responseObj}); 
            
            console.log(JSON.stringify(logMessageList, null, 2));

            for (let msg of logMessageList) {
                let requestMessageId = (JSON.parse(msg.requestMessage))[1];
                let responseMessageId = (JSON.parse(msg.responseMessage))[1];

                //console.log(JSON.parse(msg.requestMessage));
                //console.log(JSON.parse(msg.responseMessage));

                expect(requestMessageId).toMatch(responseMessageId);
                console.log(`${requestMessageId} ===  ${responseMessageId}`);
            }
            console.log(`Verified ${logMessageList.length} Request/Response pairs`);
            
        })

})


