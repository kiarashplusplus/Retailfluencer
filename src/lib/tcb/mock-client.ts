import type {
    TCBClient,
    DepositParams,
    DepositResponse,
    FetchCodeParams,
    FetchCodeResponse,
    MasterOfferFile
} from './types';

/**
 * Mock TCB Client for development and testing.
 * Generates realistic but fake GS1 codes and fetch codes.
 * Uses timestamp-based serials to ensure uniqueness across restarts.
 */
export class MockTCBClient implements TCBClient {
    async deposit(params: DepositParams): Promise<DepositResponse> {
        // Generate unique serialized GS1s using timestamp + random
        const gs1s = params.gs1s.map((baseGs1) => {
            const timestamp = Date.now().toString(36); // Base36 for compactness
            const random = Math.random().toString(36).substring(2, 6);
            const serial = (timestamp + random).toUpperCase().padStart(12, '0').slice(-12);
            return `${baseGs1}${serial}`;
        });

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 100));

        return {
            success: true,
            gs1s,
            client_txn_id: params.client_txn_id
        };
    }

    async createFetchCode(params: FetchCodeParams): Promise<FetchCodeResponse> {
        // Generate 16-digit mock fetch code using crypto-safe random
        const fetchCode = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');

        return {
            fetch_code: fetchCode,
            expires_at: new Date(Date.now() + params.validity_in_seconds * 1000)
        };
    }

    async getMasterOfferFiles(): Promise<MasterOfferFile[]> {
        // Return empty array for mock mode
        return [];
    }
}
