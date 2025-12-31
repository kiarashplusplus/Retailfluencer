import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
    listAutomations,
    createAutomation,
    toggleAutomation,
    type TriggerType,
    type ActionType
} from '$lib/services/automation';

// GET /api/automations?brandId=xxx
export const GET: RequestHandler = async ({ url }) => {
    const brandId = url.searchParams.get('brandId');

    if (!brandId) {
        throw error(400, 'brandId query parameter is required');
    }

    const automations = await listAutomations(brandId);

    return json(automations);
};

// POST /api/automations - Create new automation
export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();

    if (!data.brandId || !data.name || !data.triggerType) {
        throw error(400, 'Missing required fields: brandId, name, triggerType');
    }

    // Validate trigger type
    const validTriggers: TriggerType[] = ['customer_created', 'coupon_redeemed'];
    if (!validTriggers.includes(data.triggerType)) {
        throw error(400, `Invalid trigger type. Must be one of: ${validTriggers.join(', ')}`);
    }

    // Validate action types if steps provided
    const validActions: ActionType[] = ['send_email', 'send_sms', 'create_affiliate', 'wait'];
    if (data.steps) {
        for (const step of data.steps) {
            if (!validActions.includes(step.actionType)) {
                throw error(400, `Invalid action type: ${step.actionType}. Must be one of: ${validActions.join(', ')}`);
            }
        }
    }

    const automation = await createAutomation({
        brandId: data.brandId,
        name: data.name,
        triggerType: data.triggerType as TriggerType,
        isActive: data.isActive ?? true,
        steps: data.steps,
    });

    return json(automation, { status: 201 });
};

// PATCH /api/automations - Toggle automation status
export const PATCH: RequestHandler = async ({ request }) => {
    const data = await request.json();

    if (!data.id || typeof data.isActive !== 'boolean') {
        throw error(400, 'Missing required fields: id, isActive');
    }

    const automation = await toggleAutomation(data.id, data.isActive);

    return json(automation);
};
