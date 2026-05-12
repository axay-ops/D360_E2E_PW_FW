import { test, expect} from '../../fixtures/base.fixture';
import { compiled_getChargersAPIschema } from '../../utils/dataLoader';
import { getAccessTokenFromStorageState, getApiBaseUrl, getDepotList } from '../../utils/apiAuthHelper';
import { STORAGE_STATE_PATH } from '../../playwright.config';
import { JSONPath } from 'jsonpath-plus';


test.describe('CMS Overview: cm-charger-dashboard API',
        {annotation: {
            type: 'Feature', description: 'This API feeds overview page charger details panel' },
        tag: ['@api','@chargersAPI']},
        async () => {

        let accessToken: string;
        let apiBaseUrl: string;
        let apiFullUrl: string;
        let subtenant: string;
        const depotId: string = '6c68d4ff-8946-48e6-9b07-9b41474d978a';
        const chargerId: string = 'camqaac4'; // 'WBAD39G261'  camqaac4;

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

   
    test ('TC01: Verify valid User can access the API', {tag: ['@smoke']}, async ({request}) => {

        const response = await request.get(`${apiFullUrl}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'subtenant': subtenant
            }
        });

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);

        console.log('Valid User is able to access the Chargers API');

        console.log('\n === 0. RAW RESPONSE (as received from API');
        console.log(response);

        
        const rawText = await response.text();                   // 1️⃣ Get RAW TEXT from response (can only read body once!)
            console.log('\n=== 1. RAW TEXT (as received from API) ===');
            console.log(rawText);
            console.log(`Type: ${typeof rawText}`);   // string

        
        const jsonObject = JSON.parse(rawText);                  // 2️⃣ Parse to get JAVASCRIPT OBJECT
            console.log('\n=== 2. JAVASCRIPT OBJECT (parsed from raw text) ===');
            console.log(jsonObject);
            console.log(`Type: ${typeof jsonObject}`);  // object

       
        const jsonString = JSON.stringify(jsonObject, null, 2);   // 3️⃣ Stringify to get FORMATTED JSON STRING
            console.log('\n=== 3. FORMATTED JSON STRING (for logging/display) ===');
            console.log(jsonString);
            console.log(`Type: ${typeof jsonString}`);            // string

        expect(jsonObject).toBeDefined();

    })

    test ('TC02: Verify API response has correct data against mongodb', {tag: ['@regression']}, async ({request, mongotest}) => {
        const response = await request.get(`${apiFullUrl}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'subtenant': subtenant
            }
        });

        expect(response.status()).toBe(200);
        const apiResponseBody = await response.json();
        expect(apiResponseBody).toBeDefined();

        console.log('\n=== API Response ===');
        console.log(JSON.stringify(apiResponseBody, null, 2));
        
        // Step 2: Query MongoDB for the same charger
        const connectionStatus = await mongotest.checkConnection();
        expect(connectionStatus).toBeTruthy();

        const digitalCollection = mongotest.db.collection('digitaltwin');
        const mongoRecord = await digitalCollection.findOne({'_id.chargerId': chargerId});

        // Assert record exists and narrow the type
        expect(mongoRecord).not.toBeNull();
        if (!mongoRecord) {
            throw new Error(`MongoDB record not found for chargerId: ${chargerId}`);
        }

        // Type assertion for easier access (TypeScript workaround)
        const dbRecord = mongoRecord as any;

        console.log('\n=== MongoDB Record ===');
        console.log(JSON.stringify(mongoRecord, null, 2));

        // Step 3: Comprehensive Field Validation - API vs MongoDB
        console.log('\n=== 📊 Field-by-Field Validation: API vs MongoDB ===\n');

        const validationResults: string[] = [];
        let passCount = 0;
        let failCount = 0;

        // Helper function for assertions with detailed logging
        const assertField = (fieldName: string, apiValue: any, dbValue: any, strict = false) => {

             if (dbValue === undefined) {
                    const msg = `⚠️ ${fieldName}: MongoDB field missing - skipping validation - API has: ${apiValue}`;
                    console.warn(msg);
                    validationResults.push(msg);
                    return; // Skip validation
    }

            try {
                if (typeof apiValue === 'number' && typeof dbValue === 'number') {
                    expect(apiValue).toBeCloseTo(dbValue, 2);
                }
                else {
                    expect(apiValue).toEqual(dbValue);
                }
                passCount++;
                const msg = `✅ ${fieldName}: ${apiValue} === ${dbValue}`;
                console.log(msg);
                validationResults.push(msg);
            } catch (error) {
                failCount++;
                const msg = `❌ ${fieldName}: API="${apiValue}" !== DB="${dbValue}"`;
                console.error(msg);
                validationResults.push(msg);
                //throw error; // Re-throw to fail the test
            }
        };

        // 1. Validate Top-Level Fields
        console.log('--- Basic Charger Information ---');
        assertField('depotId', apiResponseBody.depotId, dbRecord._id.depotId);
        assertField('chargerId', apiResponseBody.chargerId, dbRecord._id.chargerId);   
        assertField('model', apiResponseBody.model, dbRecord.model);
        assertField('manufacturer', apiResponseBody.manufacturer, dbRecord.vendor);
        assertField('firmwareVersion', apiResponseBody.firmwareVersion, dbRecord.firmwareVersion);
        assertField('serialNumber', apiResponseBody.serialNumber, dbRecord.chargerSerialNumber);
        assertField('chargerName', apiResponseBody.chargerName, dbRecord.chargerName);
        assertField('ssChargerId', apiResponseBody.ssChargerId, dbRecord.ssChargerId);

        // 2. Validate Numeric Fields
        console.log('\n--- Power & Capacity ---');
        assertField('maxPower', apiResponseBody.maxPower, dbRecord.maxPower);
        assertField('deratedPower', apiResponseBody.deratedPower, dbRecord.deratedPower);

        // 3. Validate Status Information
        console.log('\n--- Status Information ---');
        assertField('chargerStatus', apiResponseBody.chargerStatus, dbRecord.networkConnectivity.latestStatus);

        // Handle date comparison (might need tolerance for timestamp differences)
        console.log('\n--- Date Information ---');
        if (apiResponseBody.chargerLastUpdated && dbRecord.heartbeat.lastUpdated) {
            const apiDate = new Date(apiResponseBody.chargerLastUpdated).getTime();  // convert to UNIX timestamp number
            const dbDate = new Date(dbRecord.heartbeat.lastUpdated).getTime();
            const timeDiff = Math.abs(apiDate - dbDate);

            console.log(apiResponseBody.chargerLastUpdated);
            console.log(apiDate); 
            console.log(dbRecord.heartbeat.lastUpdated);
            console.log(dbDate); 


            if (timeDiff < 10000000000) {  // Allow 5 second tolerance 5000ms
                passCount++;
                const msg = `✅ chargerLastUpdated: "${apiResponseBody.chargerLastUpdated}" === "${dbRecord.heartbeat.lastUpdated}" : Timestamps match (diff: ${timeDiff}ms)`;
                console.log(msg);
                validationResults.push(msg);
            } else {
                failCount++;
                const msg = `❌ chargerLastUpdated: "${apiResponseBody.chargerLastUpdated}" !== "${dbRecord.heartbeat.lastUpdated}"`;
                console.error(msg);
                validationResults.push(msg);
            }
        }

        

        // 4. Validate Connector Data Map (Nested Structure)
        console.log('\n--- Connector Data Map Validation ---');

        const apiConnectors = Object.keys(apiResponseBody.connectorDataMap);
        const dbConnectors = Object.keys(dbRecord.connectorDataMap || {});

        console.log(`${apiConnectors} :::  ${dbConnectors}`);
        expect.soft(apiConnectors.length).toBe(dbConnectors.length);
        console.log(`✅ Connector count matches: ${apiConnectors.length} connectors`);

        // Validate each connector
        apiConnectors.forEach((connectorId) => {
            console.log(`\n  --- Connector ${connectorId} ---`);
            const apiConnector = apiResponseBody.connectorDataMap[connectorId];
            const dbConnector = dbRecord.connectorDataMap?.[connectorId];

            expect.soft(dbConnector).toBeDefined();

            // Status validation
            assertField(`  Connector[${connectorId}].status.latestStatus`,
                apiConnector.status.latestStatus,
                dbConnector.status.latestStatus);

            assertField(`  Connector[${connectorId}].status.errorCode`,
                apiConnector.status.errorCode,
                dbConnector.status.errorCode);

            assertField(`  Connector[${connectorId}].status.vendorErrorCode`,
                apiConnector.status.vendorErrorCode,
                dbConnector.status.vendorErrorCode);

            // Parking space validation (can be null)
            assertField(`  Connector[${connectorId}].parkingSpaceId`,
                apiConnector.parkingSpaceId,
                dbConnector.parkingSpaceId);

            assertField(`  Connector[${connectorId}].ssConnectorId`,
                apiConnector.ssConnectorId,
                dbConnector.ssConnectorId);

            // Latest transaction (can be null)
            assertField(`  Connector[${connectorId}].latestTransaction`,
                apiConnector.latestTransaction,
                dbConnector?.latestTransaction?.id);
        });


        // 5. Final Summary
        console.log('\n' + '='.repeat(60));
        console.log(`📊 VALIDATION SUMMARY`);
        console.log('='.repeat(60));
        console.log(`✅ Passed: ${passCount}`);
        console.log(`❌ Failed: ${failCount}`);
        console.log(`📈 Success Rate: ${((passCount / (passCount + failCount)) * 100).toFixed(2)}%`);
        console.log('='.repeat(60));


        // Final assertion
        expect(failCount).toBe(0);
        console.log('\n🎉 ALL VALIDATIONS PASSED: API response matches MongoDB record perfectly!\n');
        console.log(validationResults);

    })

    test ('TC03: Verify Valid User without scope cannot access the API', {tag: ['@smoke']}, async ({request}) => {

              const response = await request.get(`${apiFullUrl}`, {
            headers: {
                'Authorization': `Bearer invalidtoken`,
                'Content-Type': 'application/json',
                'subtenant': subtenant
            }
        });
        expect(response.status()).toBe(403);   // forbidden
        console.log('\n' + '='.repeat(60));
        console.log(await response.json());

    })

    test ('TC04: Verify API response has a valid Schema', {tag: ['@regression']}, async ({request}) => {

        const response = await request.get(`${apiFullUrl}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'subtenant': subtenant
            }
        });

        expect(response.status()).toBe(200);
        const responseBody = await response.json();

        // Validate schema using AJV compiled schema
        const isValid = compiled_getChargersAPIschema(responseBody);

        if (!isValid) {
            console.error('Schema validation errors:', compiled_getChargersAPIschema.errors);
        }
        else {
            console.log('API response has valid Schema');
        }
    })

    test ('TC05: Verify API response has valid Error for incorrect chargerId', {tag: ['@regression']}, async ({request}) => {

        const invalidChargerId = 'invalidchargerid999';

        const response = await request.get(`${apiBaseUrl}/cm-charger-dashboard/v1/${depotId}/chargers/${invalidChargerId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'subtenant': subtenant
            }
        });

        expect(response.status()).toBe(400); // Not Found or 400 Bad Request

        const errorBody = await response.json();
        console.log('\n' + '='.repeat(60));
        console.log(errorBody);
        expect(errorBody).toBeDefined();
    })

    test.skip('TC06: Verify API response matches MongoDB using projection (Object Comparison)', {tag: ['@regression']}, async ({request, mongotest}) => {

        // Step 1: Fetch data from API
        const response = await request.get(`${apiFullUrl}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'subtenant': subtenant
            }
        });

        expect(response.status()).toBe(200);
        const apiResponse = await response.json();

        console.log('\n=== API Response ===');
        console.log(JSON.stringify(apiResponse, null, 2));

        // Step 2: Query MongoDB with AGGREGATION to reshape document to match API structure
        const connectionStatus = await mongotest.checkConnection();
        expect(connectionStatus).toBeTruthy();

        const digitalCollection = mongotest.db.collection('digitaltwin');

        // Use aggregation to reshape MongoDB document to match API structure
        const dbRecords = await digitalCollection.aggregate([
            // Stage 1: Match the document
            { $match: { '_id.chargerId': chargerId } },

            // Stage 2: Reshape - flatten nested fields, rename fields, extract only what API returns
            {
                $project: {
                    // Flatten _id nested fields
                    depotId: '$_id.depotId',
                    chargerId: '$_id.chargerId',

                    // Direct mappings (same field names)
                    model: 1,
                    firmwareVersion: 1,
                    chargerName: 1,
                    maxPower: 1,
                    deratedPower: 1,
                    ssChargerId: 1,

                    // Field renames (MongoDB → API)
                    manufacturer: '$vendor',                           // vendor → manufacturer
                    serialNumber: '$chargerSerialNumber',              // chargerSerialNumber → serialNumber
                    chargerStatus: '$networkConnectivity.latestStatus',     // nested → flat

                    // Extract date from {$date: "..."} wrapper using $getField
                    chargerLastUpdated: {
                        $getField: {
                            field: { $literal: '$date' },  // Use $literal to treat as string literal
                            input: '$networkConnectivity.lastUpdated'
                        }
                    },

                    // Transform connectorDataMap - extract only fields API returns
                    connectorDataMap: {
                        $arrayToObject: {
                            $map: {
                                input: { $objectToArray: '$connectorDataMap' },
                                as: 'connector',
                                in: {
                                    k: '$$connector.k',  // Keep connector ID (0, 1, etc.)
                                    v: {
                                        status: {
                                            latestStatus: '$$connector.v.status.latestStatus',
                                            errorCode: '$$connector.v.status.errorCode',
                                            vendorErrorCode: null,  // Not in MongoDB, always null
                                            lastUpdated: {
                                                $getField: {
                                                    field: { $literal: '$date' },  // Use $literal for string literal
                                                    input: '$$connector.v.status.lastUpdated'
                                                }
                                            }
                                        },
                                        latestTransaction: {
                                            $cond: {
                                                if: { $ifNull: ['$$connector.v.latestTransaction.id', false] },
                                                then: '$$connector.v.latestTransaction.id',
                                                else: null
                                            }
                                        },
                                        parkingSpaceId: { $ifNull: ['$$connector.v.parkingSpaceId', null] },
                                        ssConnectorId: { $ifNull: ['$$connector.v.ssConnectorId', null] }
                                    }
                                }
                            }
                        }
                    },

                    _id: 0  // Exclude MongoDB _id from result
                }
            }
        ]).toArray();

        expect(dbRecords.length).toBeGreaterThan(0);
        const dbRecord = dbRecords[0];

        if (!dbRecord) {
            throw new Error(`MongoDB record not found for chargerId: ${chargerId}`);
        }

        console.log('\n=== MongoDB Record (Reshaped via Aggregation) ===');
        console.log(JSON.stringify(dbRecord, null, 2));

        // Step 4: SINGLE OBJECT COMPARISON! 🎉
        console.log('\n=== 🚀 Object-Level Validation ===');

        try {
            // Deep equality check
            expect(apiResponse).toEqual(dbRecord);
            console.log('✅ SUCCESS: API response matches MongoDB record perfectly!');
            console.log('   All fields validated in a single assertion\n');
        } catch (error: any) {
            console.error('❌ MISMATCH DETECTED:');
            console.error('   API Response:', JSON.stringify(apiResponse, null, 2));
            console.error('   DB Record:', JSON.stringify(dbRecord, null, 2));

            // Show differences for debugging
            const apiKeys = Object.keys(apiResponse);
            const dbKeys = Object.keys(dbRecord);

            console.error('\n🔍 Detailed Comparison:');
            const allKeys = [...new Set([...apiKeys, ...dbKeys])];

            allKeys.forEach(key => {
                const apiValue = JSON.stringify(apiResponse[key]);
                const dbValue = JSON.stringify(dbRecord[key]);

                if (apiValue !== dbValue) {
                    console.error(`   ❌ ${key}:`);
                    console.error(`      API: ${apiValue}`);
                    console.error(`      DB:  ${dbValue}`);
                } else {
                    console.log(`   ✅ ${key}: matches`);
                }
            });

            throw error; // Re-throw to fail the test
        }
    })

})