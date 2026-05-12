import { test, expect} from '../../fixtures/base.fixture';
import { logviewerPage } from '../../pages/03_logviewerPage';
import * as APPCONSTANTS from '../../data/app-constants'
import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse/sync'; 


test('TC01: Verify Message Type dropdown values in OCPP Log Viewer', async ({ AdminhomePage }) => {

   
    expect(await AdminhomePage.isLoggedIn()).toBeTruthy();

    // Navigate to OCPP Log Viewer page
    const ocppLogViewerPage: logviewerPage  = await AdminhomePage.navigateOCPPlogs();
    expect(await ocppLogViewerPage.isPageLoaded()).toBeTruthy();

    const actualDropdownValues = await ocppLogViewerPage.getMessageTypeDropdownValues();
    expect(actualDropdownValues).toEqual(APPCONSTANTS.OCPPLOGS_MESSAGETYPES);

    console.log('Message Type dropdown values validated successfully');
});


test.skip('TC02: Verify Message Type dropdown has no duplicate values', async ({ AdminhomePage }) => {

    // Navigate to OCPP Log Viewer page
    expect(await AdminhomePage.isLoggedIn()).toBeTruthy();
    const ocppLogViewerPage: logviewerPage = await AdminhomePage.navigateOCPPlogs();

    // Wait for page to load
    expect(await ocppLogViewerPage.isPageLoaded()).toBeTruthy();

    // Get all dropdown values including any duplicates that may exist
    const allDropdownValues = await ocppLogViewerPage.getMessageTypeDropdownValuesWithDuplicates();

    // Check for duplicates
    const uniqueValues = new Set(allDropdownValues);
    const hasDuplicates = allDropdownValues.length !== uniqueValues.size;

    // Find and log duplicates if any exist
    if (hasDuplicates) {
        const duplicates = allDropdownValues.filter((item, index) => allDropdownValues.indexOf(item) !== index);
        console.error(`❌ Duplicates found: ${[...new Set(duplicates)]}`);
        console.error(`Total values: ${allDropdownValues.length}, Unique: ${uniqueValues.size}`);
    }

    // Assert no duplicates exist
    expect(hasDuplicates).toBe(false);
    expect(allDropdownValues.length).toBe(uniqueValues.size);

    console.log(`✓ Verified ${allDropdownValues.length} unique dropdown values with no duplicates`);
});


test ('TC03: Verify Export/Download functionality', async ({AdminhomePage}) => {

    const downloadPath = path.join(process.cwd(), 'downloads/ocpplogs.csv');
    expect(await AdminhomePage.isLoggedIn()).toBeTruthy();

    // Navigate to OCPP Log Viewer page
    const ocppLogViewerPage: logviewerPage  = await AdminhomePage.navigateOCPPlogs();
    expect(await ocppLogViewerPage.isPageLoaded()).toBeTruthy();

    await ocppLogViewerPage.ExportLogs(downloadPath); 

    expect(fs.existsSync(downloadPath)).toBeTruthy();

    const filecontent = fs.readFileSync(downloadPath, 'utf-8');
    const records = parse(filecontent, {columns: true, skip_empty_lines: true });

    const expectedRows = await ocppLogViewerPage.getAllRowCount();
    expect(records.length).toEqual(expectedRows);
    console.log(records.length);
    console.log(records);

    // Remove file
    if (fs.existsSync(downloadPath)) {
         fs.unlinkSync(downloadPath);
    }

})