import * as fs from 'fs';
import * as path from 'path';

/**
 * API Authentication Helper
 * Extracts access tokens from storage state files for API testing
 */

interface StorageState {
    cookies: any[];
    origins: Array<{
        origin: string;
        localStorage: Array<{
            name: string;
            value: string;
        }>;
    }>;
}

/**
 * Extracts the Cognito access token from a storage state JSON file
 * @param storageStatePath - Path to the storage state file (e.g., 'playwright/.auth/qa-admin.json')
 * @returns Access token string without quotes
 */
export function getAccessTokenFromStorageState(storageStatePath: string): string {
    try {
        const fullPath = path.resolve('', storageStatePath);

        if (!fs.existsSync(fullPath)) {
            throw new Error(`Storage state file not found: ${fullPath}`);
        }

        const storageState: StorageState = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

        // Find the access token in localStorage
        const accessTokenEntry = storageState.origins[0]?.localStorage.find(
            (item) => item.name === 'accessToken'
        );

        if (!accessTokenEntry) {
            throw new Error(`Access token not found in storage state: ${storageStatePath}`);
        }

        // Remove surrounding quotes if present
        return accessTokenEntry.value.replace(/^"|"$/g, '');

    } catch (error: any) {
        throw new Error(`Failed to extract access token: ${error.message}`);
    }
}

/**
 * Extracts the full Cognito access token with key name from storage state
 * Useful when you need the full localStorage key name
 * @param storageStatePath - Path to the storage state file
 * @returns Object with key name and token value
 */
export function getCognitoAccessToken(storageStatePath: string): { key: string; token: string } {
    try {
        const fullPath = path.resolve('', storageStatePath);
        const storageState: StorageState = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));

        const cognitoTokenEntry = storageState.origins[0]?.localStorage.find(
            (item) => item.name.includes('.accessToken')
        );

        if (!cognitoTokenEntry) {
            throw new Error(`Cognito access token not found in: ${storageStatePath}`);
        }

        return {
            key: cognitoTokenEntry.name,
            token: cognitoTokenEntry.value
        };

    } catch (error: any) {
        throw new Error(`Failed to extract Cognito token: ${error.message}`);
    }
}

/**
 * Gets API base URL from metadata or environment
 * @param testInfo - Playwright TestInfo object
 * @returns API base URL
 */
export function getApiBaseUrl(testInfo?: any): string {
    // Try to get from testInfo metadata first
    if (testInfo?.project?.metadata?.d360BaseAPI) {
        return testInfo.project.metadata.d360BaseAPI;
    }

    // Fallback to environment variable
    const apiUrl = process.env.D360_API_URL;

    if (!apiUrl) {
        throw new Error('D360_API_URL not found in metadata or environment variables');
    }

    return apiUrl;
}

export function getDepotList(storageStatePath: string): string {
    try {
        const fullpath = path.resolve('', storageStatePath);
        
        if (!fs.existsSync(fullpath)) {
            throw new Error(`Storage state file not found: ${fullpath}`);
        }

        const storageState: StorageState =  JSON.parse(fs.readFileSync(fullpath, 'utf-8'));

        const depotListEntry = storageState.origins[0]?.localStorage.find(
            (item) => item.name === 'DEPOTS'
        );

            if (!depotListEntry) {
                throw new Error ('DEPOTS not found in Storate state');
            }

            return depotListEntry.value;

    } catch (error: any) {
        throw new Error (`Failed to extract Depot List: ${error.message}`) 
    }

}