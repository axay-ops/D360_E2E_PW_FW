import { defineConfig, devices } from '@playwright/test';
import dotenvx from '@dotenvx/dotenvx'
import path from 'path';

    /*    ENV=qa is set
          dotenvx.config() loads .env.qa
          dotenvx automatically looks for DOTENV_PRIVATE_KEY_QA in the environment
          It uses that key to decrypt the encrypted values in .env.qa
    */
const ENV = process.env.ENV || 'qa';
dotenvx.config({ path: path.resolve("", `.env.${ENV}`) });  // Load from .env files based on ENV

export const STORAGE_STATE_PATH = (role: string) => {
       return path.join("", `playwright/.auth/${ENV}-${role}.json`);  //set path for Storage state json files based on env. 
      }


export default defineConfig({

  globalSetup: './tests/global-setup.ts',
  globalTimeout: 5 * 60 * 1000,   // Entire run       - 0s (No limit)
  timeout: 1 * 60 * 1000,         // Single Test run  - 30s
  expect: {timeout: 30000},       // WebAssertion     - 5s

  testDir: './tests',
  fullyParallel: true,                       /* Run tests in files in parallel */
  retries: process.env.CI ? 0 : 0,
  workers: process.env.CI ? 1 : undefined,   // undefined
  forbidOnly: !!process.env.CI,              //* Fail the build on CI if you accidentally left test.only in the source code. */

  
  // Shared settings for all the projects below
  use: {

    actionTimeout: 30000,           //  Action Timeout     (0s, falls back to timeout)
    navigationTimeout: 60000,       //  Navigation Timeout (0s, falls back to timeout)
    
    baseURL: process.env.D360_BASE_URL,   /* Base URL to use in actions like `await page.goto('')`. */
    trace: 'retain-on-failure',           /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    screenshot: {
        mode: 'on',
        fullPage: true},
    video: 'on',
    viewport: { width: 1920, height: 1080 },                  //  viewport: { width: 1920, height: 1080 }  null=machine default full size.
    headless: process.env.CI ? true : (process.env.HEADLESS === 'true'),  // headless: !!process.env.CI,  false locally, true in CI
    testIdAttribute: 'custom-data-test-id', // default = data-testid 
    httpCredentials: {
      'username': 'admin',
      'password': 'admin'
    },
  },

  metadata: {
    d360BaseAPI:  process.env.D360_API_URL,    //  this metadata will be accessible in tests, fixtures and auth via testInfo.project.metadata.appUsername */ 
    gorestAPI:  process.env.GOREST_API_URL,
    gorestAPItoken:  process.env.GOREST_API_TOKEN,
  },

      // Configure projects for major browsers
  projects: [
    { name: 'setup', 
      testMatch: /.*\.setup\.ts/  
    },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
       dependencies: ['setup'] 
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },

  reporter: [
    ['html', {open: 'always'}],  //{open: 'never'}
    ['list'],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: true,
      categories: [
        {
          name: 'Product Defects',
          messageRegex: '.*AssertionError.*',
        },
        {
          name: 'Test Issues',
          messageRegex: '.*TypeError.*',
        },
      ],
      environmentInfo: {
        'Test.Environment': (process.env.ENV || 'qa').toUpperCase(),
        'Application.Name': 'D360 Charge Management System',
        'Application.Version': 'v1.0.4',
        'Application.Base.URL': process.env.D360_BASE_URL,
        'API.Base.URL': process.env.D360_API_URL,
        'Framework': 'Playwright',
        'Framework.Version': '1.59.0',
        'Node.Version': process.version,
        'Test.Type': 'E2E Automated Regression',
        'Execution.Mode': process.env.CI ? 'CI/CD Pipeline' : 'Local Execution',
        'Browser': 'Chromium',
        'Parallel.Execution': 'Enabled',
        'Workers': process.env.CI ? '1' : 'Auto',
        'Retries': process.env.CI ? '0' : '0',
        'Project': 'D360 CMS',
        'QA.Team': 'Senior SDET Team',
        'Database': 'MongoDB'
      }
    }],
    ['playwright-html-reporter', {
      testFolder: 'tests',
      title: 'D360 E2E Testing',
      project: 'D360 CMS',
      release: '10.1.6',
      testEnvironment: process.env.ENV || 'QA',
      embedAssets: true,
      embedAttachments: true,
      outputFolder: 'playwright-html-report',
      minifyAssets: true,
      startServer: process.env.CI ? false : false
    }],
  //   ['varadi', {
  //    outputFolder: 'varadi-report',
  //    outputFile: 'index.html',
  //    title: 'Varadi - Namma Playwright Report'
  //  }]
  ]

});





/* 
import { defineConfig } from '@playwright/test';
      //       ↑ Import the wrapper function (NOT a default config)

export default defineConfig({  
      //             ↑ Call the function
      //             ↓ Pass YOUR config object
        globalSetup: './tests/global-setup.ts',
        timeout: 1 * 60 * 1000,
        testDir: './tests',
        projects: [
          { name: 'setup', testMatch: /.*\.setup\.ts/ },
          { name: 'chromium', dependencies: ['setup'] }
        ]
});

//  ↑ Function returns your object back (typed)


Without defineConfig:
------------------------
export default {
    globalSetup: './tests/global-setup.ts',
    timeoutt: 60000,  // ❌ Typo! TypeScript won't catch this
    projekts: []       // ❌ Typo! No error
};


With defineConfig:
------------------
export default defineConfig({
    globalSetup: './tests/global-setup.ts',
    timeoutt: 60000,  // ✅ TypeScript error: "Did you mean 'timeout'?"
    projekts: []       // ✅ TypeScript error: "Did you mean 'projects'?"
});

---------------------------------------------
NEXT: The Flow:  defineConfig  to  FullConfig
----------------------------------------------

    You write config with defineConfig()
              ↓
        defineConfig returns your object
              ↓
    Playwright receives your config
              ↓
    Playwright processes it:
      - Resolves undefined to defaults
      - Computes derived values
      - Fills in missing properties
      - Expands project configs
              ↓
    Playwright passes RESOLVED config to globalSetup
              ↓
    Your globalSetup receives it as FullConfig

// */