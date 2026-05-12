/**
 * Allure Report Helper Utilities
 * Provides production-grade decorators and helper functions for enhanced Allure reporting
 * @author Senior SDET Team
 * @version 1.0.0
 */

import * as allure from 'allure-js-commons';

/**
 * Severity levels for test cases
 */
export enum Severity {
    BLOCKER = 'blocker',
    CRITICAL = 'critical',
    NORMAL = 'normal',
    MINOR = 'minor',
    TRIVIAL = 'trivial'
}

/**
 * Test layers for better organization
 */
export enum Layer {
    API = 'api',
    UI = 'ui',
    INTEGRATION = 'integration',
    E2E = 'e2e',
    UNIT = 'unit'
}

/**
 * Epic categorization for high-level features
 */
export enum Epic {
    AUTHENTICATION = 'Authentication',
    CHARGER_MANAGEMENT = 'Charger Management',
    DEPOT_OPERATIONS = 'Depot Operations',
    USER_MANAGEMENT = 'User Management',
    REPORTING = 'Reporting & Analytics',
    OCPP_PROTOCOL = 'OCPP Protocol',
    DATABASE = 'Database Integration'
}

/**
 * Feature categorization
 */
export enum Feature {
    LOGIN = 'Login',
    LOGOUT = 'Logout',
    CHARGER_DASHBOARD = 'Charger Dashboard',
    CHARGER_API = 'Charger API',
    OCPP_LOGS = 'OCPP Logs',
    OVERVIEW_PAGE = 'Overview Page',
    DATA_VALIDATION = 'Data Validation',
    SCHEMA_VALIDATION = 'Schema Validation',
    ERROR_HANDLING = 'Error Handling'
}

/**
 * Story categorization
 */
export enum Story {
    USER_LOGIN = 'User Login Flow',
    CHARGER_STATUS = 'Charger Status Monitoring',
    API_INTEGRATION = 'API Integration',
    DATA_CONSISTENCY = 'Data Consistency Checks',
    SECURITY = 'Security & Authorization'
}

/**
 * Owner/Team assignment
 */
export enum Owner {
    QA_TEAM = 'QA Team',
    API_TEAM = 'API Squad',
    UI_TEAM = 'UI Squad',
    PLATFORM_TEAM = 'Platform Team',
    SENIOR_SDET = 'Senior SDET'
}

/**
 * Allure Helper Class with production-grade decorators
 */
export class AllureHelper {

    /**
     * Add test description with markdown support
     */
    static description(description: string): void {
        allure.description(description);
    }

    /**
     * Add detailed test description in HTML format
     */
    static descriptionHtml(html: string): void {
        allure.descriptionHtml(html);
    }

    /**
     * Set severity level for the test
     */
    static severity(severity: Severity): void {
        allure.severity(severity as allure.Severity);
    }

    /**
     * Add Epic label (highest level categorization)
     */
    static epic(epic: Epic | string): void {
        allure.epic(epic);
    }

    /**
     * Add Feature label
     */
    static feature(feature: Feature | string): void {
        allure.feature(feature);
    }

    /**
     * Add Story label
     */
    static story(story: Story | string): void {
        allure.story(story);
    }

    /**
     * Add owner/team label
     */
    static owner(owner: Owner | string): void {
        allure.owner(owner);
    }

    /**
     * Add test layer label
     */
    static layer(layer: Layer): void {
        allure.label('layer', layer);
    }

    /**
     * Add link to Jira ticket
     */
    static jira(ticketId: string, url?: string): void {
        const jiraUrl = url || `https://your-jira-instance.atlassian.net/browse/${ticketId}`;
        allure.issue(jiraUrl, ticketId);
    }

    /**
     * Add link to test case in test management system
     */
    static testCaseLink(testCaseId: string, url?: string): void {
        const tcUrl = url || `https://your-testcase-system.com/case/${testCaseId}`;
        allure.tms(tcUrl, testCaseId);
    }

    /**
     * Add custom link
     */
    static link(url: string, name: string, type: string = 'custom'): void {
        allure.link(url, name, type);
    }

    /**
     * Add environment parameter
     */
    static parameter(name: string, value: any): void {
        allure.parameter(name, String(value));
    }

    /**
     * Add attachment (screenshot, logs, JSON, etc.)
     */
    static attachment(name: string, content: Buffer | string, type: string): void {
        allure.attachment(name, content, type);
    }

    /**
     * Attach JSON data
     */
    static attachJson(name: string, data: any): void {
        allure.attachment(name, JSON.stringify(data, null, 2), 'application/json');
    }

    /**
     * Attach text logs
     */
    static attachText(name: string, text: string): void {
        allure.attachment(name, text, 'text/plain');
    }

    /**
     * Create a step in Allure report
     */
    static async step<T>(name: string, body: () => T | Promise<T>): Promise<T> {
        return await allure.step(name, async () => {
            return await body();
        });
    }

    /**
     * Add custom label
     */
    static label(name: string, value: string): void {
        allure.label(name, value);
    }

    /**
     * Add multiple tags
     */
    static tags(...tags: string[]): void {
        tags.forEach(tag => allure.tag(tag));
    }

    /**
     * Mark test as flaky
     */
    static flaky(): void {
        allure.label('flaky', 'true');
    }

    /**
     * Add test environment details
     */
    static testEnvironment(env: {
        browser?: string;
        os?: string;
        nodeVersion?: string;
        baseUrl?: string;
        [key: string]: any;
    }): void {
        Object.entries(env).forEach(([key, value]) => {
            allure.parameter(key, String(value));
        });
    }

    /**
     * Log API request details
     */
    static logApiRequest(method: string, url: string, headers?: any, body?: any): void {
        const requestDetails = {
            method,
            url,
            headers: headers || {},
            body: body || null,
            timestamp: new Date().toISOString()
        };
        this.attachJson('API Request', requestDetails);
    }

    /**
     * Log API response details
     */
    static logApiResponse(status: number, statusText: string, headers?: any, body?: any): void {
        const responseDetails = {
            status,
            statusText,
            headers: headers || {},
            body: body || null,
            timestamp: new Date().toISOString()
        };
        this.attachJson('API Response', responseDetails);
    }

    /**
     * Log database query
     */
    static logDbQuery(collection: string, query: any, result?: any): void {
        const dbDetails = {
            collection,
            query,
            result: result || null,
            timestamp: new Date().toISOString()
        };
        this.attachJson('Database Query', dbDetails);
    }

    /**
     * Add test execution time
     */
    static executionTime(startTime: number, endTime: number): void {
        const duration = endTime - startTime;
        allure.parameter('Execution Time (ms)', String(duration));
        allure.parameter('Execution Time (s)', String((duration / 1000).toFixed(2)));
    }

    /**
     * Add test case preconditions
     */
    static precondition(precondition: string): void {
        allure.label('precondition', precondition);
    }

    /**
     * Add test case postconditions
     */
    static postcondition(postcondition: string): void {
        allure.label('postcondition', postcondition);
    }

    /**
     * Production-grade test metadata decorator
     */
    static setTestMetadata(metadata: {
        epic: Epic | string;
        feature: Feature | string;
        story: Story | string;
        severity: Severity;
        owner: Owner | string;
        layer: Layer;
        jiraTicket?: string;
        testCaseId?: string;
        tags?: string[];
        description?: string;
    }): void {
        this.epic(metadata.epic);
        this.feature(metadata.feature);
        this.story(metadata.story);
        this.severity(metadata.severity);
        this.owner(metadata.owner);
        this.layer(metadata.layer);

        if (metadata.jiraTicket) {
            this.jira(metadata.jiraTicket);
        }

        if (metadata.testCaseId) {
            this.testCaseLink(metadata.testCaseId);
        }

        if (metadata.tags) {
            this.tags(...metadata.tags);
        }

        if (metadata.description) {
            this.description(metadata.description);
        }
    }
}

/**
 * Export singleton instance for convenience
 */
export const allureHelper = AllureHelper;
