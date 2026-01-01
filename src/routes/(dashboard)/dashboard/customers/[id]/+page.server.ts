import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { mockCustomers, mockRedemptions, mockInfluencers } from '$lib/mock-data';

export const load: PageServerLoad = async ({ params }) => {
    const customer = mockCustomers.find(c => c.id === params.id);

    if (!customer) {
        throw error(404, `Customer not found: ${params.id}`);
    }

    // Mock additional data for the detail view
    // In a real app, this would come from the database

    // Check if this customer is an affiliate
    // Demo: Sarah Jones, Mike Foodie, and "Super Fan" (demo account) are affiliates
    const isAffiliate = ['sarah.jones@email.com', 'mikefoodie@gmail.com', 'superfan@gmail.com'].includes(customer.email || '');

    const affiliateData = isAffiliate ? {
        code: (customer.email === 'sarah.jones@email.com' ? 'SARAH2026' :
            customer.email === 'mikefoodie@gmail.com' ? 'MIKE_EATS' : 'SUPER_FAN'),
        earnings: (customer.email === 'sarah.jones@email.com' ? 45.50 :
            customer.email === 'mikefoodie@gmail.com' ? 89.25 : 12.50),
        commission: (customer.email === 'mikefoodie@gmail.com' ? 15 : 10),
        totalReferrals: (customer.email === 'sarah.jones@email.com' ? 12 :
            customer.email === 'mikefoodie@gmail.com' ? 24 : 3)
    } : null;

    // Mock activity log
    const activities = [
        { id: 'act-1', type: 'redemption', description: 'Redeemed coupon for Summer Hydration', date: '2025-12-30T14:30:00Z' },
        { id: 'act-2', type: 'visit', description: 'Visited tracking link from Sarah Fit', date: '2025-12-30T14:15:00Z' },
        { id: 'act-3', type: 'email', description: 'Opened "Welcome" email', date: '2025-12-28T09:00:00Z' },
        { id: 'act-4', type: 'signup', description: 'Joined customer list', date: '2025-12-28T08:55:00Z' }
    ];

    if (isAffiliate) {
        activities.unshift({ id: 'act-0', type: 'affiliate', description: 'Converted to Affiliate', date: '2025-12-31T10:00:00Z' });
        activities.unshift({ id: 'act-new', type: 'referral', description: 'Generated a sale (Referral from MIKE_EATS)', date: '2026-01-01T11:20:00Z' });
    }

    return {
        customer: {
            ...customer,
            isAffiliate,
            affiliateData,
            ltv: 120.50, // Lifetime Value
            lastActive: '2026-01-01T11:20:00Z'
        },
        activities
    };
};
