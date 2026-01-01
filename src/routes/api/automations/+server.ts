import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Sample automations for demo (with fixed dates for consistency)
const DEMO_DATE = '2026-01-01T00:00:00Z';

const sampleAutomations = [
    {
        id: 'auto-001',
        name: 'Welcome New Customer',
        triggerType: 'customer_created',
        isActive: true,
        createdAt: DEMO_DATE,
        steps: [
            { id: 'step-001', stepOrder: 1, actionType: 'send_email', actionConfig: '{"template":"welcome"}', delaySeconds: 0 },
            { id: 'step-002', stepOrder: 2, actionType: 'wait', actionConfig: '{"hours":24}', delaySeconds: 86400 },
            { id: 'step-003', stepOrder: 3, actionType: 'send_email', actionConfig: '{"template":"share_referral"}', delaySeconds: 0 }
        ]
    },
    {
        id: 'auto-002',
        name: 'Snowball - Convert to Affiliate',
        triggerType: 'coupon_redeemed',
        isActive: true,
        createdAt: DEMO_DATE,
        steps: [
            { id: 'step-004', stepOrder: 1, actionType: 'send_email', actionConfig: '{"template":"thank_you"}', delaySeconds: 0 },
            { id: 'step-005', stepOrder: 2, actionType: 'wait', actionConfig: '{"days":3}', delaySeconds: 259200 },
            { id: 'step-006', stepOrder: 3, actionType: 'create_affiliate', actionConfig: '{"commission":10}', delaySeconds: 0 },
            { id: 'step-007', stepOrder: 4, actionType: 'send_email', actionConfig: '{"template":"affiliate_welcome"}', delaySeconds: 0 }
        ]
    },
    {
        id: 'auto-003',
        name: 'Repeat Purchase Reminder',
        triggerType: 'coupon_redeemed',
        isActive: false,
        createdAt: DEMO_DATE,
        steps: [
            { id: 'step-008', stepOrder: 1, actionType: 'wait', actionConfig: '{"days":14}', delaySeconds: 1209600 },
            { id: 'step-009', stepOrder: 2, actionType: 'send_email', actionConfig: '{"template":"repurchase_reminder"}', delaySeconds: 0 }
        ]
    }
];

// Mutable list for created automations
const createdAutomations: typeof sampleAutomations = [];

// GET /api/automations?brandId=xxx
export const GET: RequestHandler = async () => {
    // Return sample + created automations
    return json([...sampleAutomations, ...createdAutomations]);
};

// POST /api/automations - Create new automation
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    const newAutomation = {
        id: `auto-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        steps: data.steps?.map((s: { actionType: string; actionConfig: Record<string, unknown>; delaySeconds: number }, i: number) => ({
            id: `step-${Date.now()}-${i}`,
            stepOrder: i + 1,
            actionType: s.actionType,
            actionConfig: JSON.stringify(s.actionConfig || {}),
            delaySeconds: s.delaySeconds || 0
        })) || []
    };
    createdAutomations.unshift(newAutomation);
    return json(newAutomation, { status: 201 });
};

// PATCH /api/automations - Toggle automation
export const PATCH: RequestHandler = async ({ request }) => {
    const data = await request.json();

    // Update in sample automations
    const sample = sampleAutomations.find(a => a.id === data.id);
    if (sample) {
        sample.isActive = data.isActive;
    }

    // Update in created automations
    const created = createdAutomations.find(a => a.id === data.id);
    if (created) {
        created.isActive = data.isActive;
    }

    return json({ id: data.id, isActive: data.isActive });
};
