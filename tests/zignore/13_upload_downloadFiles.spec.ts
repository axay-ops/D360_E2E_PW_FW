
/* 
    FILE UPLOAD: 

        "type = file" in DOM -- Use setInputFiles method
     
        For Multiple Files  -- DOM will have 'multiple' attribute.
                            -- page.waitForEvent('fileChooser') inside promise.all().

    FILE DOWNLOAD: 
                            -- page.waitForEvent('download')    inside promise.all().


*/


import { test, expect, Locator, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import {parse} from 'csv-parse/sync'; 


test ('Single File Upload and Remove', async ({ page }) => {

    await page.goto('https://naveenautomationlabs.com/opencart/ui/file-upload.html');
    await page.locator('#single-file').setInputFiles('C:\\UserData\\z004rjcs\\OneDrive - Siemens AG\\Desktop\\UPLOAD\\upload1.txt'); 
    await page.waitForTimeout(5000);
    await page.locator('#single-file').setInputFiles([]);  // remove attached file
    await page.waitForTimeout(5000);
});


test ('Multiple File Upload', async ({ page }) => {

    await page.goto('https://naveenautomationlabs.com/opencart/ui/file-upload.html');
    await page.locator('#multi-file').setInputFiles(
        ["C:\\UserData\z004rjcs\\OneDrive - Siemens AG\\Desktop\\UPLOAD\\upload1.txt", 
          "C:\\UserData\z004rjcs\\OneDrive - Siemens AG\\Desktop\\UPLOAD\\upload2.txt"
        ]
    ); 

});

test ('File Upload when type = file not available', async ({ page }) => {

    await page.goto('https://naveenautomationlabs.com/opencart/ui/file-upload.html');

    const [fileUpload] = await Promise.all([
            page.waitForEvent('filechooser'),
            await page.locator('#custom-upload-btn').click()
    ])
  

    fileUpload.setFiles('C:\\UserData\\z004rjcs\\OneDrive - Siemens AG\\Desktop\\UPLOAD\\upload1.txt'); 

});



test ('File Download', async ({ page }) => {

    await page.goto('https://naveenautomationlabs.com/opencart/ui/file-upload.html');

    const [filedownload] = await Promise.all([
            page.waitForEvent('download'),
            await page.locator('#exportBtn').click()
    ])
   
    // during downloading, expect failure to be null.
    expect(await filedownload.failure()).toBeNull(); 

    // get file name
    const filename = filedownload.suggestedFilename();
    console.log(filename); 

    // save file to sepecific path
    const filepath = './downloads/'+filedownload.suggestedFilename()
    filedownload.saveAs(filepath);


    // Verify file exists
    expect(fs.existsSync(filepath)).toBeTruthy();

    // verify filesize 
    const filesize= fs.statSync(filepath).size;
    expect(filesize).toBeGreaterThan(0);

    //read file
    let csvcontent = fs.readFileSync(filepath,'utf8');

    const Userdata = parse(csvcontent, {
        columns: true,
        skip_empty_lines: true 
        });
        
});

