import { test, expect} from '../../fixtures/base.fixture';
import { compiled_putdeleteChargerConfigApiSchema } from '../../utils/dataLoader';
import { getAccessTokenFromStorageState, getApiBaseUrl, getDepotList } from '../../utils/apiAuthHelper';
import { STORAGE_STATE_PATH } from '../../playwright.config';
import { JSONPath } from 'jsonpath-plus';


test.describe.serial('CMS Charger Config APIs',
        { annotation: {
            type: 'Feature', description: 'This API feeds Charger Configuration Page' },
        tag: ['@api','@defaultprofilesAPI']},
        async () => {

        let accessToken: string;
        let apiBaseUrl: string;
        let apiChargerConfig: string;
        let subtenant: string;
        const depotId: string = '6c68d4ff-8946-48e6-9b07-9b41474d978a';
        const rate: number = 8000;    // 'WBAD39G261'  camqaac4;

        // https://a5x34lbbgk.execute-api.us-east-1.amazonaws.com/txdefault/v1/profiles
       
        test.beforeAll(async ({}, testInfo) => {
            accessToken = getAccessTokenFromStorageState(STORAGE_STATE_PATH('admin')); 
            subtenant = getDepotList(STORAGE_STATE_PATH('admin'));
            apiBaseUrl = getApiBaseUrl(testInfo); 
            apiChargerConfig = apiBaseUrl.concat('/txdefault/v1/profiles');
            console.log(`API Full URL : ${apiChargerConfig}`);
            console.log(`Access Token extracted : ${accessToken.substring(0, 20)}...`);
            console.log(`Depot List : ${subtenant}`);
        });

   
        test ('TC01: PUT request Add the Default profile', {tag: ['@smoke']}, async ({request}) => {

            const requestData = {
                "depotChargerProfiles": [{
                    "depotId": depotId,
                    "chargerId": "WBAD39G261",
                    "chargerName": "Akshay - Home Charger",
                    "priority": null,
                    "deleteProfile": null,
                    "connectorData": [{
                        "connectorId": 0,
                        "chargingRate": rate,
                        "chargingUnit": "W"
                    }]
                }]
            };

            console.log(`PUT ${apiChargerConfig} | Data: ${JSON.stringify(requestData)}`);

            const response = await request.put(`${apiChargerConfig}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'subtenant': subtenant
                },
                data: requestData
            });

            expect(response.ok()).toBeTruthy();
            expect(response.status()).toBe(200);

            const responseObj = await response.json();
            console.log(JSON.stringify(responseObj, null, 2))

            let isSchemaValid = compiled_putdeleteChargerConfigApiSchema(responseObj);
            expect(isSchemaValid).toBeTruthy();
            console.log('Charger Config API response has a valid schema');

            const chargingRate: any[] = JSONPath({path: '$.data..connectorData[0].chargingRate', json: responseObj}); 
            expect(chargingRate[0]).toBe(rate);
            console.log('Response has correct charging rate'); 

            const depotID: any[] =  JSONPath({path: `$.data..depotId`, json: responseObj});
            expect(depotID[0]).toEqual(depotId); 
            console.log('Response has correct Depot Id');
        });


        test ('TC02: DELETE Charging profile', {tag: ['@smoke']}, async ({request}) => {
            const requestData =     
            {
                "depotChargerProfiles": [{
                    "depotId": depotId,
                    "chargerId": "WBAD39G261",
                    "chargerName": "Akshay - Home Charger",
                    "priority": null,
                    "deleteProfile": true,
                    "connectorData": [{
                        "connectorId": 0,
                        "chargingRate": rate,
                        "chargingUnit": "W"
                    }]
                }]
            };

            console.log(`PUT ${apiChargerConfig} | Data: ${JSON.stringify(requestData)}`);

            const response = await request.delete(`${apiChargerConfig}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                    'subtenant': subtenant
                },
                data: requestData
            });

            expect(response.ok()).toBeTruthy();
            expect(response.status()).toBe(200);

            const responseObj = await response.json();
            console.log(JSON.stringify(responseObj, null, 2))

            let isSchemaValid = compiled_putdeleteChargerConfigApiSchema(responseObj);
            expect(isSchemaValid).toBeTruthy();
            console.log('Charger Config API response has a valid schema');

            const chargingRate: any[] = JSONPath({path: '$.data..connectorData[0].chargingRate', json: responseObj}); 
            expect(chargingRate[0]).toBe(rate);
            console.log('Response has correct charging rate'); 

            const depotID: any[] =  JSONPath({path: `$.data..depotId`, json: responseObj});
            expect(depotID[0]).toEqual(depotId); 
            console.log('Response has correct Depot Id');

            const deleteFlag = JSONPath({path: '$.data.chargerDefaults[0].deleteProfile' , json: responseObj})
            expect.soft((deleteFlag[0])).not.toBe(null); 
            expect.soft(deleteFlag[0]).toBeTruthy();
            expect.soft(deleteFlag[0]).toEqual(true);
        });


    })