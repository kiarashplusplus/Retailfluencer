import { z } from 'zod';

// ============ Brand Schemas ============
export const createBrandSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    slug: z
        .string()
        .min(1, 'Slug is required')
        .max(255)
        .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    logoUrl: z.string().url().optional(),
    tcbFunderId: z.string().max(100).optional()
});

export const updateBrandSchema = createBrandSchema.partial();

// ============ Product Schemas ============
export const createProductSchema = z.object({
    brandId: z.string().uuid('Invalid brand ID'),
    name: z.string().min(1, 'Name is required').max(255),
    sku: z.string().max(100).optional(),
    gtin: z
        .string()
        .max(14)
        .regex(/^\d*$/, 'GTIN must be numeric')
        .optional(),
    cogs: z.number().positive().optional(),
    retailPrice: z.number().positive().optional(),
    imageUrl: z.string().url().optional()
});

export const updateProductSchema = createProductSchema.omit({ brandId: true }).partial();

// ============ Retailer Schemas ============
export const createRetailerSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    slug: z
        .string()
        .min(1, 'Slug is required')
        .max(255)
        .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
    logoUrl: z.string().url().optional(),
    supports8112: z.boolean().default(true),
    regions: z.array(z.string()).optional()
});

export const updateRetailerSchema = createRetailerSchema.partial();

// ============ Campaign Schemas ============
export const campaignStatusSchema = z.enum(['draft', 'active', 'paused', 'ended']);
export type CampaignStatus = z.infer<typeof campaignStatusSchema>;

export const discountTypeSchema = z.enum(['fixed', 'percent', 'bogo']);
export type DiscountType = z.infer<typeof discountTypeSchema>;

export const createCampaignSchema = z
    .object({
        brandId: z.string().uuid('Invalid brand ID'),
        productId: z.string().uuid('Invalid product ID'),
        retailerId: z.string().uuid('Invalid retailer ID').optional(),
        name: z.string().min(1, 'Name is required').max(255),
        discountType: discountTypeSchema,
        discountValue: z.number().min(0, 'Discount must be positive'),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        maxRedemptions: z.number().int().positive().optional(),
        funderId: z.string().max(100).optional()
    })
    .refine((data) => data.endDate > data.startDate, {
        message: 'End date must be after start date',
        path: ['endDate']
    });

export const updateCampaignSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    discountType: discountTypeSchema.optional(),
    discountValue: z.number().min(0).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    maxRedemptions: z.number().int().positive().optional(),
    status: campaignStatusSchema.optional()
});

// ============ Influencer Schemas ============
export const createInfluencerSchema = z.object({
    brandId: z.string().uuid('Invalid brand ID'),
    name: z.string().min(1, 'Name is required').max(255),
    email: z.string().email('Invalid email').optional(),
    instagramHandle: z
        .string()
        .max(100)
        .regex(/^@?[\w.]+$/, 'Invalid Instagram handle')
        .optional(),
    tiktokHandle: z
        .string()
        .max(100)
        .regex(/^@?[\w.]+$/, 'Invalid TikTok handle')
        .optional()
});

export const updateInfluencerSchema = createInfluencerSchema.omit({ brandId: true }).partial();

// ============ Coupon Assignment Schemas ============
export const assignCouponSchema = z.object({
    influencerId: z.string().uuid('Invalid influencer ID')
});

// ============ Customer Capture Schemas ============
export const captureCustomerSchema = z.object({
    gs1: z.string().min(1, 'GS1 code is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().optional()
});

// ============ Simulate Redemption Schemas ============
export const simulateRedemptionSchema = z.object({
    serializedGs1: z.string().min(1, 'Serialized GS1 is required'),
    retailerLocation: z.string().optional()
});

// ============ Validation Helper ============
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
        const firstError = result.error.issues[0];
        throw new Error(`${firstError.path.join('.')}: ${firstError.message}`);
    }
    return result.data;
}
