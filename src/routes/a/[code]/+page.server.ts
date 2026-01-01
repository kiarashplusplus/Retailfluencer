import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

// Sample affiliate codes mapping
const affiliateCodes: Record<string, { name: string; customerId: string; commissionPercent: number }> = {
    'SARAH2026': { name: 'Sarah Jones', customerId: 'cust-001', commissionPercent: 10 },
    'MIKE_EATS': { name: 'Mike Foodie', customerId: 'cust-002', commissionPercent: 15 },
    'JESS_WELL': { name: 'Jess Wellness', customerId: 'cust-003', commissionPercent: 10 },
    'RUNNER_A': { name: 'Alex Runner', customerId: 'cust-004', commissionPercent: 10 }
};

export const load: PageServerLoad = async ({ params }) => {
    const code = params.code.toUpperCase();
    const affiliate = affiliateCodes[code];

    if (!affiliate) {
        throw error(404, `Affiliate code "${params.code}" not found`);
    }

    return {
        code: params.code,
        affiliate: {
            ...affiliate,
            code: params.code
        }
    };
};
