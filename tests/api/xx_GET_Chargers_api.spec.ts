/**
 * Enhanced Charger Dashboard API Tests - Production Grade
 * @description Comprehensive API validation with MongoDB data consistency checks
 * @author Senior SDET Team
 * @version 2.0.0
 * @jira D360-1234
 */

import { test, expect } from '../../fixtures/base.fixture';
import { compiled_getChargersAPIschema } from '../../utils/dataLoader';
import { getAccessTokenFromStorageState, getApiBaseUrl, getDepotList } from '../../utils/apiAuthHelper';
import { STORAGE_STATE_PATH } from '../../playwright.config';
import {
    allureHelper,
    Severity,
    Epic,
    Feature,
    Story,
    Owner,
    Layer
} from '../../utils/allureHelper';

test.describe('Charger Management API - Dashboard Service',
    {
        annotation: {
            type: 'Epic',
            description: 'D360-EP-001: Charger Management & Monitoring'
        },
        tag: ['@api', '@chargersAPI', '@critical', '@production']
    },
    async () => {

        let accessToken: string;
        let apiBaseUrl: string;
        let apiFullUrl: string;
        let subtenant: string;
        const depotId: string = '6c68d4ff-8946-48e6-9b07-9b41474d978a';
        const chargerId: string = 'camqaac4';

        test.beforeAll(async ({ }, testInfo) => {

            accessToken = getAccessTokenFromStorageState(STORAGE_STATE_PATH('admin'));
            subtenant = getDepotList(STORAGE_STATE_PATH('admin'));
            apiBaseUrl = getApiBaseUrl(testInfo);
            apiFullUrl = apiBaseUrl.concat('/cm-charger-dashboard/v1/').concat(`${depotId}/chargers/${chargerId}`);

            console.log(`\n${'='.repeat(80)}`);
            console.log(`🚀 TEST SUITE INITIALIZATION - Charger Dashboard API`);
            console.log(`${'='.repeat(80)}`);
            console.log(`📍 Environment    : ${process.env.ENV || 'QA'}`);
            console.log(`🌐 API Base URL   : ${apiBaseUrl}`);
            console.log(`🔑 Access Token   : ${accessToken.substring(0, 20)}...`);
            console.log(`🏢 Depot ID       : ${depotId}`);
            console.log(`⚡ Charger ID     : ${chargerId}`);
            console.log(`🏪 Subtenant      : ${subtenant}`);
            console.log(`${'='.repeat(80)}\n`);
        });


        test('TC01: Verify Authenticated User Can Access Charger API',
            {
                tag: ['@smoke', '@authentication', '@P0'],
                annotation: {
                    type: 'TestCase',
                    description: 'TC-API-001: Validates successful API access with valid JWT token'
                }
            },
            async ({ request }) => {

                // Set Allure metadata
                allureHelper.setTestMetadata({
                    epic: Epic.CHARGER_MANAGEMENT,
                    feature: Feature.CHARGER_API,
                    story: Story.SECURITY,
                    severity: Severity.BLOCKER,
                    owner: Owner.API_TEAM,
                    layer: Layer.API,
                    jiraTicket: 'D360-1001',
                    testCaseId: 'TC-API-001',
                    tags: ['smoke', 'authentication', 'security'],
                    description: `
**Test Objective:**
Verify that an authenticated user with valid JWT token can successfully access the Charger Dashboard API endpoint.

**Preconditions:**
- Valid admin user credentials available
- Access token extracted from storage state
- API endpoint is accessible

**Test Steps:**
1. Prepare API request with valid authentication headers
2. Send GET request to charger dashboard API
3. Verify response status is 200 OK
4. Validate response structure

**Expected Results:**
- API returns HTTP 200 status code
- Valid JSON response with charger details
- No authentication errors
`
                });

                const startTime = Date.now();

                // Step 1: Prepare and log request
                await allureHelper.step('Step 1: Prepare API Request with Authentication', async () => {
                    allureHelper.parameter('API Endpoint', apiFullUrl);
                    allureHelper.parameter('HTTP Method', 'GET');
                    allureHelper.parameter('Auth Type', 'Bearer Token');
                    allureHelper.parameter('Depot ID', depotId);
                    allureHelper.parameter('Charger ID', chargerId);

                    allureHelper.logApiRequest('GET', apiFullUrl, {
                        'Authorization': `Bearer ${accessToken.substring(0, 30)}...`,
                        'Content-Type': 'application/json',
                        'subtenant': subtenant
                    });
                });

                // Step 2: Execute API request
                const response = await allureHelper.step('Step 2: Execute GET Request to Charger API', async () => {
                    const res = await request.get(`${apiFullUrl}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                            'subtenant': subtenant
                        }
                    });
                    return res;
                });

                // Step 3: Validate response status
                await allureHelper.step('Step 3: Validate Response Status Code', async () => {
                    expect(response.ok(), `Expected response to be OK but got status ${response.status()}`).toBeTruthy();
                    expect(response.status()).toBe(200);

                    allureHelper.parameter('Response Status', response.status().toString());
                    allureHelper.parameter('Response Status Text', response.statusText());
                });

                // Step 4: Parse and validate response body
                const responseBody = await allureHelper.step('Step 4: Parse and Validate Response Body', async () => {
                    const body = await response.json();
                    expect(body, 'Response body should be defined and not empty').toBeDefined();

                    allureHelper.logApiResponse(
                        response.status(),
                        response.statusText(),
                        await response.headers(),
                        body
                    );

                    return body;
                });

                // Log execution time
                const endTime = Date.now();
                allureHelper.executionTime(startTime, endTime);

                console.log(`✅ TC01 PASSED: Authenticated user successfully accessed Charger API`);
                console.log(`⏱️  Execution Time: ${endTime - startTime}ms\n`);
            }
        );


        test('TC02: Verify API Response Data Consistency with MongoDB',
            {
                tag: ['@regression', '@dataValidation', '@database', '@P1'],
                annotation: {
                    type: 'TestCase',
                    description: 'TC-API-002: Validates data consistency between API response and MongoDB source'
                }
            },
            async ({ request, mongotest }) => {

                // Set Allure metadata
                allureHelper.setTestMetadata({
                    epic: Epic.DATABASE,
                    feature: Feature.DATA_VALIDATION,
                    story: Story.DATA_CONSISTENCY,
                    severity: Severity.CRITICAL,
                    owner: Owner.QA_TEAM,
                    layer: Layer.INTEGRATION,
                    jiraTicket: 'D360-1002',
                    testCaseId: 'TC-API-002',
                    description: `
**Test Objective:**
Ensure complete data consistency between API response and MongoDB database records for charger information.

**Validation Scope:**
- Basic charger information (ID, name, model, manufacturer)
- Technical specifications (maxPower, deratedPower, firmwareVersion)
- Status information and timestamps
- Connector data map with all nested properties
- Cross-field validations

**Database:**
- Collection: digitaltwin
- Query: {'_id.chargerId': '${chargerId}'}
`
                });

                const startTime = Date.now();

                // Step 1: Fetch data from API
                const apiResponseBody = await allureHelper.step('Step 1: Fetch Charger Data from API', async () => {
                    const response = await request.get(`${apiFullUrl}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                            'subtenant': subtenant
                        }
                    });

                    expect(response.status()).toBe(200);
                    const body = await response.json();
                    expect(body).toBeDefined();

                    allureHelper.attachJson('API Response - Full Charger Data', body);
                    return body;
                });

                // Step 2: Connect to MongoDB and fetch record
                const mongoRecord = await allureHelper.step('Step 2: Fetch Charger Data from MongoDB', async () => {
                    const connectionStatus = await mongotest.checkConnection();
                    expect(connectionStatus, 'MongoDB connection should be established').toBeTruthy();

                    allureHelper.parameter('Database', 'MongoDB');
                    allureHelper.parameter('Collection', 'digitaltwin');
                    allureHelper.parameter('Query', `{'_id.chargerId': '${chargerId}'}`);

                    const digitalCollection = mongotest.db.collection('digitaltwin');
                    const record = await digitalCollection.findOne({ '_id.chargerId': chargerId });

                    expect(record, `MongoDB record not found for chargerId: ${chargerId}`).not.toBeNull();

                    allureHelper.logDbQuery('digitaltwin', { '_id.chargerId': chargerId }, record);
                    return record as any;
                });

                // Step 3: Field-by-field validation
                const validationResults = await allureHelper.step('Step 3: Comprehensive Field Validation', async () => {

                    const results: string[] = [];
                    let passCount = 0;
                    let failCount = 0;

                    const assertField = (fieldName: string, apiValue: any, dbValue: any) => {
                        if (dbValue === undefined) {
                            const msg = `⚠️  ${fieldName}: MongoDB field missing - API has: ${apiValue}`;
                            console.warn(msg);
                            results.push(msg);
                            allureHelper.parameter(`⚠️ ${fieldName}`, 'DB field missing');
                            return;
                        }

                        try {
                            if (typeof apiValue === 'number' && typeof dbValue === 'number') {
                                expect(apiValue).toBeCloseTo(dbValue, 2);
                            } else {
                                expect(apiValue).toEqual(dbValue);
                            }
                            passCount++;
                            const msg = `✅ ${fieldName}: ${apiValue} === ${dbValue}`;
                            console.log(msg);
                            results.push(msg);
                        } catch (error) {
                            failCount++;
                            const msg = `❌ ${fieldName}: API="${apiValue}" !== DB="${dbValue}"`;
                            console.error(msg);
                            results.push(msg);
                            allureHelper.parameter(`❌ ${fieldName}`, `API: ${apiValue} | DB: ${dbValue}`);
                        }
                    };

                    // Basic Information Validation
                    await allureHelper.step('3.1: Validate Basic Charger Information', async () => {
                        assertField('depotId', apiResponseBody.depotId, mongoRecord._id.depotId);
                        assertField('chargerId', apiResponseBody.chargerId, mongoRecord._id.chargerId);
                        assertField('model', apiResponseBody.model, mongoRecord.model);
                        assertField('manufacturer', apiResponseBody.manufacturer, mongoRecord.vendor);
                        assertField('firmwareVersion', apiResponseBody.firmwareVersion, mongoRecord.firmwareVersion);
                        assertField('serialNumber', apiResponseBody.serialNumber, mongoRecord.chargerSerialNumber);
                        assertField('chargerName', apiResponseBody.chargerName, mongoRecord.chargerName);
                        assertField('ssChargerId', apiResponseBody.ssChargerId, mongoRecord.ssChargerId);
                    });

                    // Power Specifications Validation
                    await allureHelper.step('3.2: Validate Power & Capacity Specifications', async () => {
                        assertField('maxPower', apiResponseBody.maxPower, mongoRecord.maxPower);
                        assertField('deratedPower', apiResponseBody.deratedPower, mongoRecord.deratedPower);
                    });

                    // Status Information Validation
                    await allureHelper.step('3.3: Validate Status Information', async () => {
                        assertField('chargerStatus', apiResponseBody.chargerStatus, mongoRecord.networkConnectivity?.latestStatus);
                    });

                    // Timestamp Validation
                    await allureHelper.step('3.4: Validate Timestamp Consistency', async () => {
                        if (apiResponseBody.chargerLastUpdated && mongoRecord.heartbeat?.lastUpdated) {
                            const apiDate = new Date(apiResponseBody.chargerLastUpdated).getTime();
                            const dbDate = new Date(mongoRecord.heartbeat.lastUpdated).getTime();
                            const timeDiff = Math.abs(apiDate - dbDate);

                            if (timeDiff < 10000000000) {
                                passCount++;
                                const msg = `✅ chargerLastUpdated: Timestamps match (diff: ${timeDiff}ms)`;
                                console.log(msg);
                                results.push(msg);
                            } else {
                                failCount++;
                                const msg = `❌ chargerLastUpdated: Timestamp mismatch (diff: ${timeDiff}ms)`;
                                console.error(msg);
                                results.push(msg);
                            }
                        }
                    });

                    // Connector Data Validation
                    await allureHelper.step('3.5: Validate Connector Data Map', async () => {
                        const apiConnectors = Object.keys(apiResponseBody.connectorDataMap || {});
                        const dbConnectors = Object.keys(mongoRecord.connectorDataMap || {});

                        expect.soft(apiConnectors.length).toBe(dbConnectors.length);
                        console.log(`✅ Connector count matches: ${apiConnectors.length} connectors`);

                        apiConnectors.forEach((connectorId) => {
                            const apiConnector = apiResponseBody.connectorDataMap[connectorId];
                            const dbConnector = mongoRecord.connectorDataMap?.[connectorId];

                            if (dbConnector) {
                                assertField(`Connector[${connectorId}].status.latestStatus`,
                                    apiConnector.status.latestStatus,
                                    dbConnector.status.latestStatus);

                                assertField(`Connector[${connectorId}].status.errorCode`,
                                    apiConnector.status.errorCode,
                                    dbConnector.status.errorCode);

                                assertField(`Connector[${connectorId}].ssConnectorId`,
                                    apiConnector.ssConnectorId,
                                    dbConnector.ssConnectorId);
                            }
                        });
                    });

                    return { results, passCount, failCount };
                });

                // Step 4: Generate validation summary report
                await allureHelper.step('Step 4: Generate Validation Summary Report', async () => {
                    const { passCount, failCount } = validationResults;
                    const successRate = ((passCount / (passCount + failCount)) * 100).toFixed(2);

                    const summaryReport = `
${'='.repeat(80)}
📊 DATA VALIDATION SUMMARY REPORT
${'='.repeat(80)}
✅ Validations Passed    : ${passCount}
❌ Validations Failed    : ${failCount}
📈 Success Rate          : ${successRate}%
⏱️  Total Fields Checked : ${passCount + failCount}
${'='.repeat(80)}
                    `;

                    console.log(summaryReport);

                    allureHelper.attachText('Validation Summary Report', summaryReport);
                    allureHelper.parameter('✅ Passed Validations', passCount.toString());
                    allureHelper.parameter('❌ Failed Validations', failCount.toString());
                    allureHelper.parameter('📈 Success Rate', `${successRate}%`);

                    // Final assertion
                    expect(failCount, 'All data validations should pass').toBe(0);
                });

                // Log execution time
                const endTime = Date.now();
                allureHelper.executionTime(startTime, endTime);

                console.log(`✅ TC02 PASSED: API data is consistent with MongoDB\n`);
            }
        );


        test('TC03: Verify Unauthorized Access is Blocked',
            {
                tag: ['@smoke', '@security', '@negative', '@P0'],
                annotation: {
                    type: 'TestCase',
                    description: 'TC-API-003: Validates API security by testing unauthorized access'
                }
            },
            async ({ request }) => {

                allureHelper.setTestMetadata({
                    epic: Epic.AUTHENTICATION,
                    feature: Feature.CHARGER_API,
                    story: Story.SECURITY,
                    severity: Severity.BLOCKER,
                    owner: Owner.SENIOR_SDET,
                    layer: Layer.API,
                    jiraTicket: 'D360-1003',
                    testCaseId: 'TC-API-003',
                    tags: ['security', 'negative', 'authentication'],
                    description: 'Verify that API rejects requests with invalid authentication tokens'
                });

                const startTime = Date.now();

                await allureHelper.step('Step 1: Attempt API Access with Invalid Token', async () => {
                    allureHelper.parameter('Auth Token', 'invalidtoken');
                    allureHelper.parameter('Expected Status', '403 Forbidden');

                    const response = await request.get(`${apiFullUrl}`, {
                        headers: {
                            'Authorization': `Bearer invalidtoken`,
                            'Content-Type': 'application/json',
                            'subtenant': subtenant
                        }
                    });

                    expect(response.status()).toBe(403);

                    const errorBody = await response.json();
                    allureHelper.logApiResponse(response.status(), response.statusText(), await response.headers(), errorBody);

                    console.log('✅ Unauthorized access properly blocked with 403 Forbidden');
                });

                const endTime = Date.now();
                allureHelper.executionTime(startTime, endTime);

                console.log(`✅ TC03 PASSED: Unauthorized access properly blocked\n`);
            }
        );


        test('TC04: Verify API Response Schema Validation',
            {
                tag: ['@regression', '@schema', '@P1'],
                annotation: {
                    type: 'TestCase',
                    description: 'TC-API-004: Validates API response against JSON schema'
                }
            },
            async ({ request }) => {

                allureHelper.setTestMetadata({
                    epic: Epic.CHARGER_MANAGEMENT,
                    feature: Feature.SCHEMA_VALIDATION,
                    story: Story.API_INTEGRATION,
                    severity: Severity.CRITICAL,
                    owner: Owner.API_TEAM,
                    layer: Layer.API,
                    jiraTicket: 'D360-1004',
                    testCaseId: 'TC-API-004',
                    description: 'Validate that API response structure conforms to defined JSON schema using AJV validator'
                });

                const startTime = Date.now();

                const responseBody = await allureHelper.step('Step 1: Fetch API Response', async () => {
                    const response = await request.get(`${apiFullUrl}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                            'subtenant': subtenant
                        }
                    });

                    expect(response.status()).toBe(200);
                    return await response.json();
                });

                await allureHelper.step('Step 2: Validate Against JSON Schema', async () => {
                    const isValid = compiled_getChargersAPIschema(responseBody);

                    if (!isValid) {
                        const errors = compiled_getChargersAPIschema.errors;
                        console.error('❌ Schema validation errors:', errors);
                        allureHelper.attachJson('Schema Validation Errors', errors || []);
                        expect(isValid, 'Schema validation should pass').toBeTruthy();
                    } else {
                        console.log('✅ API response has valid schema');
                        allureHelper.parameter('Schema Validation', '✅ PASSED');
                    }
                });

                const endTime = Date.now();
                allureHelper.executionTime(startTime, endTime);

                console.log(`✅ TC04 PASSED: API response schema is valid\n`);
            }
        );


        test('TC05: Verify API Error Handling for Invalid Charger ID',
            {
                tag: ['@regression', '@negative', '@errorHandling', '@P2'],
                annotation: {
                    type: 'TestCase',
                    description: 'TC-API-005: Validates proper error responses for invalid input'
                }
            },
            async ({ request }) => {

                allureHelper.setTestMetadata({
                    epic: Epic.CHARGER_MANAGEMENT,
                    feature: Feature.ERROR_HANDLING,
                    story: Story.API_INTEGRATION,
                    severity: Severity.NORMAL,
                    owner: Owner.QA_TEAM,
                    layer: Layer.API,
                    jiraTicket: 'D360-1005',
                    testCaseId: 'TC-API-005',
                    description: 'Verify that API returns appropriate error response (400 Bad Request) for invalid charger ID'
                });

                const startTime = Date.now();
                const invalidChargerId = 'invalidchargerid999';

                await allureHelper.step('Step 1: Request with Invalid Charger ID', async () => {
                    allureHelper.parameter('Invalid Charger ID', invalidChargerId);
                    allureHelper.parameter('Expected Status', '400 Bad Request');

                    const response = await request.get(`${apiBaseUrl}/cm-charger-dashboard/v1/${depotId}/chargers/${invalidChargerId}`, {
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                            'subtenant': subtenant
                        }
                    });

                    expect(response.status()).toBe(400);

                    const errorBody = await response.json();
                    expect(errorBody).toBeDefined();

                    allureHelper.logApiResponse(response.status(), response.statusText(), await response.headers(), errorBody);

                    console.log('✅ API properly returned 400 Bad Request for invalid charger ID');
                });

                const endTime = Date.now();
                allureHelper.executionTime(startTime, endTime);

                console.log(`✅ TC05 PASSED: Error handling validated successfully\n`);
            }
        );

    });
