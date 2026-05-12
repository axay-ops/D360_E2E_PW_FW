/**
 * Global Setup for Playwright Tests
 * Initializes test environment and generates enhanced Allure environment properties
 * @author Senior SDET Team
 */

import { FullConfig } from '@playwright/test';
import { createAllureEnvironment } from '../utils/allureEnvironment';
import fs from 'fs';
import path from 'path';

async function globalSetup(config: FullConfig) {
    console.log('\n' + '='.repeat(100));
    console.log('🚀 GLOBAL TEST SETUP - D360 E2E Test Framework');
    console.log('='.repeat(100));

    const ENV = process.env.ENV || 'qa';
    const isCI = !!process.env.CI;

    console.log(`📍 Environment         : ${ENV.toUpperCase()}`);
    console.log(`🌐 Base URL            : ${process.env.D360_BASE_URL}`);
    console.log(`🔌 API URL             : ${process.env.D360_API_URL}`);
    console.log(`⚙️  Execution Mode      : ${isCI ? 'CI/CD Pipeline' : 'Local'}`);
    console.log(`🔧 Workers             : ${config.workers || 'Auto (CPU cores)'}`);
    console.log(`🔄 Retries             : ${config.projects[0]?.retries || 0}`);
    console.log(`⏱️  Global Timeout      : ${config.globalTimeout || 'Not set'}ms`);
    console.log(`⏱️  Test Timeout        : ${config.projects[0]?.timeout || 30000}ms`);
    console.log('='.repeat(100) + '\n');

    // Generate enhanced Allure environment properties
    console.log('📝 Generating enhanced Allure environment properties...');

    createAllureEnvironment({
        env: ENV,
        appName: 'D360 Charge Management System',
        appVersion: 'v1.0.4',
        baseUrl: process.env.D360_BASE_URL || '',
        apiUrl: process.env.D360_API_URL || '',
        browser: 'Chromium',
        playwrightVersion: '1.59.0',
        parallel: true,
        workers: config.workers || 4,
        retries: config.projects[0]?.retries || 0,
        timeout: config.projects[0]?.timeout || 30000,
        headless: isCI || process.env.HEADLESS === 'true',
        user: 'admin',
        role: 'Administrator',
        dbType: 'MongoDB',
        dbHost: process.env.MONGO_HOST || 'Production MongoDB Cluster',
        testSuite: 'E2E Automated Regression',
        testOwner: 'Senior SDET',
        qaTeam: 'QA Engineering Team',
        project: 'D360 CMS'
    });

    console.log('✅ Environment properties generated successfully\n');

    // Ensure allure-results directory exists and copy categories.json
    const allureResultsDir = path.join(process.cwd(), 'allure-results');
    if (!fs.existsSync(allureResultsDir)) {
        fs.mkdirSync(allureResultsDir, { recursive: true });
        console.log('✅ Created allure-results directory');
    }

    // Copy categories.json if it exists
    const categoriesSource = path.join(process.cwd(), 'allure-results', 'categories.json');
    if (fs.existsSync(categoriesSource)) {
        console.log('✅ Allure categories configuration found');
    } else {
        console.log('⚠️  No categories.json found - using default categories');
    }

    console.log('\n' + '='.repeat(100));
    console.log('✅ GLOBAL SETUP COMPLETED');
    console.log('='.repeat(100) + '\n');
}

export default globalSetup;
