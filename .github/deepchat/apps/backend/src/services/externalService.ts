import axios from 'axios';
import { config } from '@backend/config';

/**
 * Example service that uses the customer's API key to interact with an external service
 */
export class ExternalService {
    private readonly apiKey: string;
    private readonly baseUrl: string;

    constructor() {
        this.apiKey = config.customer.externalApiKey;
        this.baseUrl = 'https://api.external-service.com'; // Replace with actual service URL
    }

    /**
     * Validates that the API key is properly configured
     * @throws Error if API key is not configured
     */
    private validateApiKey(): void {
        if (!this.apiKey) {
            throw new Error('Customer API key is not configured. Please set CUSTOMER_EXTERNAL_API_KEY environment variable.');
        }
    }

    /**
     * Creates an authenticated request config
     */
    private createRequestConfig() {
        return {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
        };
    }

    /**
     * Example method to call external service
     */
    async makeExternalRequest(data: any) {
        try {
            this.validateApiKey();

            const response = await axios.post(
                `${this.baseUrl}/api/endpoint`,
                data,
                this.createRequestConfig()
            );

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Invalid or expired customer API key');
                }
                throw new Error(`External service error: ${error.response?.data?.message || error.message}`);
            }
            throw error;
        }
    }
}

// Export a singleton instance
export const externalService = new ExternalService(); 