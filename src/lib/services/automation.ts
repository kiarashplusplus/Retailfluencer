import { db } from '$lib/server/db';
import { createAffiliate as affiliateCreate } from './affiliate';

export type TriggerType = 'customer_created' | 'coupon_redeemed';

export type ActionType = 'send_email' | 'send_sms' | 'create_affiliate' | 'wait';

export interface AutomationEventData {
    brandId: string;
    customerId?: string;
    campaignId?: string;
    influencerId?: string;
    redemptionId?: string;
    email?: string;
}

interface AutomationStep {
    id: string;
    stepOrder: number;
    actionType: string;
    actionConfig: string;
    delaySeconds: number;
}

interface Automation {
    id: string;
    name: string;
    triggerType: string;
    isActive: boolean;
    steps: AutomationStep[];
}

/**
 * Trigger all active automations for a given event type
 */
export async function triggerAutomations(
    triggerType: TriggerType,
    eventData: AutomationEventData
): Promise<void> {
    const automations = await db.automation.findMany({
        where: {
            triggerType,
            isActive: true,
            brandId: eventData.brandId,
        },
        include: {
            steps: {
                orderBy: { stepOrder: 'asc' },
            },
        },
    });

    console.log(`[Automation] Found ${automations.length} automations for trigger: ${triggerType}`);

    for (const automation of automations) {
        try {
            await executeAutomation(automation, eventData);
        } catch (error) {
            console.error(`[Automation] Failed to execute automation ${automation.id}:`, error);
        }
    }
}

/**
 * Execute a single automation with all its steps
 */
async function executeAutomation(
    automation: Automation,
    eventData: AutomationEventData
): Promise<void> {
    console.log(`[Automation] Executing automation: ${automation.name} (${automation.id})`);

    for (const step of automation.steps) {
        try {
            // Handle delay
            if (step.delaySeconds > 0) {
                console.log(`[Automation] Waiting ${step.delaySeconds}s before step ${step.stepOrder}`);
                // In production, this would be handled by a job queue
                // For now, we'll just log it
            }

            // Parse action config safely
            let config: Record<string, unknown> = {};
            try {
                config = JSON.parse(step.actionConfig || '{}');
            } catch {
                console.warn(`[Automation] Invalid actionConfig JSON for step ${step.stepOrder}`);
            }

            // Execute action based on type
            switch (step.actionType as ActionType) {
                case 'send_email':
                    await handleSendEmail(config, eventData);
                    break;

                case 'send_sms':
                    await handleSendSms(config, eventData);
                    break;

                case 'create_affiliate':
                    await handleCreateAffiliate(config, eventData);
                    break;

                case 'wait':
                    // Wait action is handled by delay above
                    console.log(`[Automation] Wait step completed`);
                    break;

                default:
                    console.warn(`[Automation] Unknown action type: ${step.actionType}`);
            }

            console.log(`[Automation] Completed step ${step.stepOrder}: ${step.actionType}`);
        } catch (error) {
            console.error(`[Automation] Failed step ${step.stepOrder}:`, error);
            // Continue with next step or stop? For now, continue
        }
    }

    console.log(`[Automation] Completed automation: ${automation.name}`);
}

/**
 * Handle send_email action
 */
async function handleSendEmail(
    config: { template?: string; subject?: string },
    eventData: AutomationEventData
): Promise<void> {
    console.log(`[Automation] Would send email:`, {
        template: config.template || 'default',
        subject: config.subject || 'No subject',
        to: eventData.email,
    });

    // TODO: Implement actual email sending via Azure Communication Services
    // await sendEmail({
    //   to: eventData.email,
    //   template: config.template,
    //   subject: config.subject,
    //   data: eventData,
    // });
}

/**
 * Handle send_sms action
 */
async function handleSendSms(
    config: { message?: string },
    eventData: AutomationEventData
): Promise<void> {
    console.log(`[Automation] Would send SMS:`, {
        message: config.message,
        customerId: eventData.customerId,
    });

    // TODO: Implement actual SMS sending via Azure Communication Services
}

/**
 * Handle create_affiliate action
 */
async function handleCreateAffiliate(
    config: { commissionPercent?: number },
    eventData: AutomationEventData
): Promise<void> {
    if (!eventData.customerId) {
        console.warn('[Automation] Cannot create affiliate: missing customerId');
        return;
    }

    // Check if customer already an affiliate
    const existingAffiliate = await db.affiliate.findUnique({
        where: { customerId: eventData.customerId },
    });

    if (existingAffiliate) {
        console.log(`[Automation] Customer ${eventData.customerId} is already an affiliate`);
        return;
    }

    // Create affiliate using affiliate service
    await affiliateCreate(eventData.customerId, {
        commissionPercent: (config.commissionPercent as number) || 10,
    });

    console.log(`[Automation] Created affiliate for customer ${eventData.customerId}`);
}

/**
 * Create a new automation
 */
export async function createAutomation(input: {
    brandId: string;
    name: string;
    triggerType: TriggerType;
    isActive?: boolean;
    steps?: Array<{
        stepOrder: number;
        actionType: ActionType;
        actionConfig: Record<string, unknown>;
        delaySeconds?: number;
    }>;
}) {
    const automation = await db.automation.create({
        data: {
            brandId: input.brandId,
            name: input.name,
            triggerType: input.triggerType,
            isActive: input.isActive ?? true,
            steps: input.steps
                ? {
                    create: input.steps.map((step) => ({
                        stepOrder: step.stepOrder,
                        actionType: step.actionType,
                        actionConfig: JSON.stringify(step.actionConfig),
                        delaySeconds: step.delaySeconds || 0,
                    })),
                }
                : undefined,
        },
        include: {
            steps: true,
        },
    });

    return automation;
}

/**
 * List automations for a brand
 */
export async function listAutomations(brandId: string) {
    return db.automation.findMany({
        where: { brandId },
        include: {
            steps: {
                orderBy: { stepOrder: 'asc' },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
}

/**
 * Toggle automation active status
 */
export async function toggleAutomation(automationId: string, isActive: boolean) {
    return db.automation.update({
        where: { id: automationId },
        data: { isActive },
    });
}
