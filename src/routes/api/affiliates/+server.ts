import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Sample affiliates for demo (customers who have been converted)
// NOTE: In-memory state - data resets on server restart (intentional for demo)
const sampleAffiliates = [
    {
        id: 'aff-001',
        code: 'SARAH2026',
        commissionPercent: 10,
        totalEarnings: 45.50,
        totalReferrals: 12,
        createdAt: '2025-12-15T10:00:00Z',
        customer: {
            id: 'cust-001',
            email: 'sarah.jones@email.com',
            totalRedemptions: 3,
            createdAt: '2025-12-10T08:30:00Z'
        }
    },
    {
        id: 'aff-002',
        code: 'MIKE_EATS',
        commissionPercent: 15,
        totalEarnings: 89.25,
        totalReferrals: 24,
        createdAt: '2025-12-18T14:00:00Z',
        customer: {
            id: 'cust-002',
            email: 'mikefoodie@gmail.com',
            totalRedemptions: 5,
            createdAt: '2025-12-12T11:00:00Z'
        }
    },
    {
        id: 'aff-003',
        code: 'JESS_WELL',
        commissionPercent: 10,
        totalEarnings: 32.40,
        totalReferrals: 8,
        createdAt: '2025-12-20T09:00:00Z',
        customer: {
            id: 'cust-003',
            email: 'jess.wellness@email.com',
            totalRedemptions: 2,
            createdAt: '2025-12-14T16:00:00Z'
        }
    },
    {
        id: 'aff-004',
        code: 'RUNNER_A',
        commissionPercent: 10,
        totalEarnings: 18.75,
        totalReferrals: 5,
        createdAt: '2025-12-22T11:00:00Z',
        customer: {
            id: 'cust-004',
            email: 'alex.runs@email.com',
            totalRedemptions: 1,
            createdAt: '2025-12-19T13:00:00Z'
        }
    }
];

// Mutable list for new affiliates
const createdAffiliates: typeof sampleAffiliates = [];

// GET /api/affiliates?brandId=xxx
export const GET: RequestHandler = async () => {
    return json([...sampleAffiliates, ...createdAffiliates]);
};

// POST /api/affiliates - Create affiliate
export const POST: RequestHandler = async ({ request }) => {
    let data;
    try {
        data = await request.json();
    } catch {
        throw error(400, 'Invalid JSON in request body');
    }
    const newAffiliate = {
        id: `aff-${Date.now()}`,
        code: data.code || `REF${Date.now().toString(36).toUpperCase()}`,
        commissionPercent: data.commissionPercent || 10,
        totalEarnings: 0,
        totalReferrals: 0,
        createdAt: new Date().toISOString(),
        customer: data.customer || {
            id: data.customerId,
            email: data.email,
            totalRedemptions: 0,
            createdAt: new Date().toISOString()
        }
    };
    createdAffiliates.unshift(newAffiliate);
    return json(newAffiliate, { status: 201 });
};
