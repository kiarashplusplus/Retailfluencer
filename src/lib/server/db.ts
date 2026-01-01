// D1-only database client for Cloudflare deployment
// Exports a function to get DB client from platform

import type { PrismaClient } from '@prisma/client';

// Helper to get DB client from platform - use D1 adapter
export function getDbFromPlatform(platform?: App.Platform): PrismaClient | null {
    if (!platform?.env?.DB) {
        return null;
    }

    // These are required dynamically to avoid module load issues on edge
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient: PC } = require('@prisma/client');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaD1 } = require('@prisma/adapter-d1');

    const adapter = new PrismaD1(platform.env.DB);
    return new PC({ adapter });
}
