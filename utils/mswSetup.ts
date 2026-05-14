import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

/**
 * Create MSW server for API mocking
 * Usage: call setupMockServer() in tests to mock APIs
 */

export function createMockServer() {
    return setupServer();
}

/**
 * Helper to create HTTP handlers for different status codes
 */
export const mockHandlers = {
    /**
     * Mock a 400 Bad Request response
     */
    badRequest: (url: string, errorMessage = 'Bad Request') => {
        return http.get(url, () => {
            return HttpResponse.json(
                {
                    error: 'Bad Request',
                    message: errorMessage
                },
                { status: 400 }
            );
        });
    },

    /**
     * Mock a 401 Unauthorized response
     */
    unauthorized: (url: string) => {
        return http.get(url, () => {
            return HttpResponse.json(
                {
                    error: 'Unauthorized',
                    message: 'Authentication required'
                },
                { status: 401 }
            );
        });
    },

    /**
     * Mock a 500 Internal Server Error
     */
    serverError: (url: string) => {
        return http.get(url, () => {
            return HttpResponse.json(
                {
                    error: 'Internal Server Error',
                    message: 'Something went wrong'
                },
                { status: 500 }
            );
        });
    },

    /**
     * Mock a custom response
     */
    custom: (url: string, status: number, body: any) => {
        return http.get(url, () => {
            return HttpResponse.json(body, { status });
        });
    }
};
