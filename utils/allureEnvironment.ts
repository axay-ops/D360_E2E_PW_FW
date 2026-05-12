/**
 * Allure Environment Configuration Builder
 * Generates comprehensive environment.properties file for Allure reports
 * @author Senior SDET Team
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

export interface EnvironmentInfo {
    // Test Environment
    'Test.Environment': string;
    'Test.Suite': string;
    'Test.Type': string;
    'Test.Run.Date': string;
    'Test.Run.Time': string;
    'Test.Execution.Mode': string;

    // Application Under Test
    'Application.Name': string;
    'Application.Version': string;
    'Application.Base.URL': string;
    'API.Base.URL': string;

    // Browser/Platform
    'Browser': string;
    'Browser.Version': string;
    'Platform': string;
    'OS': string;
    'OS.Version': string;

    // Framework & Tools
    'Framework': string;
    'Framework.Version': string;
    'Test.Runner': string;
    'Node.Version': string;
    'Playwright.Version': string;
    'Allure.Version': string;

    // Test Configuration
    'Parallel.Execution': string;
    'Workers': string;
    'Retries': string;
    'Timeout': string;
    'Headless.Mode': string;

    // Authentication
    'Auth.User': string;
    'Auth.Role': string;

    // Database
    'Database.Type': string;
    'Database.Host': string;

    // CI/CD
    'CI.Pipeline': string;
    'Build.Number': string;
    'Build.URL': string;

    // Team & Ownership
    'Test.Owner': string;
    'QA.Team': string;
    'Project': string;

    // Additional metadata
    [key: string]: string;
}

export class AllureEnvironmentBuilder {

    private envInfo: Partial<EnvironmentInfo> = {};

    constructor() {
        this.setDefaults();
    }

    /**
     * Set default environment values
     */
    private setDefaults(): void {
        const now = new Date();

        this.envInfo = {
            'Test.Run.Date': now.toLocaleDateString('en-US'),
            'Test.Run.Time': now.toLocaleTimeString('en-US'),
            'Framework': 'Playwright',
            'Test.Runner': 'Playwright Test Runner',
            'Node.Version': process.version,
            'Platform': process.platform,
            'OS': os.type(),
            'OS.Version': os.release(),
            'Test.Execution.Mode': process.env.CI ? 'CI/CD Pipeline' : 'Local Execution'
        };
    }

    /**
     * Set test environment details
     */
    setEnvironment(env: string, type: string = 'Automated Regression'): this {
        this.envInfo['Test.Environment'] = env.toUpperCase();
        this.envInfo['Test.Type'] = type;
        return this;
    }

    /**
     * Set application details
     */
    setApplication(name: string, version: string, baseUrl: string, apiUrl: string): this {
        this.envInfo['Application.Name'] = name;
        this.envInfo['Application.Version'] = version;
        this.envInfo['Application.Base.URL'] = baseUrl;
        this.envInfo['API.Base.URL'] = apiUrl;
        return this;
    }

    /**
     * Set browser details
     */
    setBrowser(browser: string, version: string = 'Latest'): this {
        this.envInfo['Browser'] = browser;
        this.envInfo['Browser.Version'] = version;
        return this;
    }

    /**
     * Set framework versions
     */
    setFrameworkVersions(playwrightVersion: string, allureVersion: string): this {
        this.envInfo['Playwright.Version'] = playwrightVersion;
        this.envInfo['Framework.Version'] = playwrightVersion;
        this.envInfo['Allure.Version'] = allureVersion;
        return this;
    }

    /**
     * Set test configuration
     */
    setTestConfig(config: {
        parallel?: boolean;
        workers?: number;
        retries?: number;
        timeout?: number;
        headless?: boolean;
        suite?: string;
    }): this {
        if (config.parallel !== undefined) {
            this.envInfo['Parallel.Execution'] = config.parallel ? 'Enabled' : 'Disabled';
        }
        if (config.workers !== undefined) {
            this.envInfo['Workers'] = config.workers.toString();
        }
        if (config.retries !== undefined) {
            this.envInfo['Retries'] = config.retries.toString();
        }
        if (config.timeout !== undefined) {
            this.envInfo['Timeout'] = `${config.timeout}ms`;
        }
        if (config.headless !== undefined) {
            this.envInfo['Headless.Mode'] = config.headless ? 'Yes' : 'No';
        }
        if (config.suite) {
            this.envInfo['Test.Suite'] = config.suite;
        }
        return this;
    }

    /**
     * Set authentication details
     */
    setAuthentication(user: string, role: string): this {
        this.envInfo['Auth.User'] = user;
        this.envInfo['Auth.Role'] = role;
        return this;
    }

    /**
     * Set database details
     */
    setDatabase(type: string, host: string): this {
        this.envInfo['Database.Type'] = type;
        this.envInfo['Database.Host'] = host;
        return this;
    }

    /**
     * Set CI/CD details
     */
    setCICD(pipeline: string, buildNumber: string, buildUrl: string): this {
        this.envInfo['CI.Pipeline'] = pipeline;
        this.envInfo['Build.Number'] = buildNumber;
        this.envInfo['Build.URL'] = buildUrl;
        return this;
    }

    /**
     * Set team/ownership details
     */
    setOwnership(owner: string, team: string, project: string): this {
        this.envInfo['Test.Owner'] = owner;
        this.envInfo['QA.Team'] = team;
        this.envInfo['Project'] = project;
        return this;
    }

    /**
     * Add custom property
     */
    addCustomProperty(key: string, value: string): this {
        this.envInfo[key] = value;
        return this;
    }

    /**
     * Generate environment.properties content
     */
    private generatePropertiesContent(): string {
        const lines: string[] = [];

        // Sort keys for better organization
        const sortedKeys = Object.keys(this.envInfo).sort();

        for (const key of sortedKeys) {
            const value = this.envInfo[key];
            if (value !== undefined && value !== null) {
                lines.push(`${key}=${value}`);
            }
        }

        return lines.join('\n');
    }

    /**
     * Write environment.properties file to allure-results directory
     */
    write(outputPath: string = 'allure-results'): void {
        const filePath = path.join(outputPath, 'environment.properties');

        // Ensure directory exists
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }

        const content = this.generatePropertiesContent();
        fs.writeFileSync(filePath, content, 'utf-8');

        console.log(`✅ Allure environment.properties written to: ${filePath}`);
    }

    /**
     * Get environment info as object
     */
    getEnvironmentInfo(): Partial<EnvironmentInfo> {
        return { ...this.envInfo };
    }
}

/**
 * Helper function to create environment properties from Playwright config
 */
export function createAllureEnvironment(config: {
    env?: string;
    appName?: string;
    appVersion?: string;
    baseUrl?: string;
    apiUrl?: string;
    browser?: string;
    playwrightVersion?: string;
    parallel?: boolean;
    workers?: number;
    retries?: number;
    timeout?: number;
    headless?: boolean;
    user?: string;
    role?: string;
    dbType?: string;
    dbHost?: string;
    testSuite?: string;
    testOwner?: string;
    qaTeam?: string;
    project?: string;
}): void {
    const builder = new AllureEnvironmentBuilder();

    // Set environment
    if (config.env) {
        builder.setEnvironment(config.env);
    }

    // Set application
    if (config.appName && config.baseUrl && config.apiUrl) {
        builder.setApplication(
            config.appName,
            config.appVersion || 'v1.0.0',
            config.baseUrl,
            config.apiUrl
        );
    }

    // Set browser
    if (config.browser) {
        builder.setBrowser(config.browser);
    }

    // Set framework versions
    builder.setFrameworkVersions(
        config.playwrightVersion || '1.59.0',
        '2.38.1'
    );

    // Set test config
    builder.setTestConfig({
        parallel: config.parallel,
        workers: config.workers,
        retries: config.retries,
        timeout: config.timeout,
        headless: config.headless,
        suite: config.testSuite
    });

    // Set authentication
    if (config.user && config.role) {
        builder.setAuthentication(config.user, config.role);
    }

    // Set database
    if (config.dbType && config.dbHost) {
        builder.setDatabase(config.dbType, config.dbHost);
    }

    // Set ownership
    if (config.testOwner && config.qaTeam && config.project) {
        builder.setOwnership(config.testOwner, config.qaTeam, config.project);
    }

    // Write to file
    builder.write();
}
