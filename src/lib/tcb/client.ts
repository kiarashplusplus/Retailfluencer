import type { TCBClient } from './types';
import { MockTCBClient } from './mock-client';

// Real client will be imported here once TCB partnership is established
// import { RealTCBClient } from './real-client';

/**
 * TCB Client Factory
 * Returns mock or real client based on TCB_MODE environment variable.
 */
function createTCBClient(): TCBClient {
    const mode = process.env.TCB_MODE || 'mock';

    if (mode === 'live') {
        // TODO: Return real client once partnership established
        // return new RealTCBClient();
        console.warn('TCB_MODE is "live" but real client not yet implemented. Falling back to mock.');
        return new MockTCBClient();
    }

    return new MockTCBClient();
}

export const tcbClient = createTCBClient();
