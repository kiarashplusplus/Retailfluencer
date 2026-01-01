// Static mock data for demo deployment
// This data is bundled with the application and works on Cloudflare edge

export const mockBrand = {
    id: 'demo-brand-001',
    name: 'HealthyLife Organics',
    slug: 'healthylife-organics',
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200&h=200',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

export const mockRetailers = [
    { id: 'ret-001', name: 'Target', slug: 'target', logoUrl: '/images/retailers/target.png', supports8112: true, _count: { campaigns: 1, redemptions: 22 } },
    { id: 'ret-002', name: 'Walmart', slug: 'walmart', logoUrl: '/images/retailers/walmart.png', supports8112: true, _count: { campaigns: 0, redemptions: 0 } },
    { id: 'ret-003', name: 'Whole Foods Market', slug: 'whole-foods', logoUrl: '/images/retailers/whole-foods.png', supports8112: true, _count: { campaigns: 1, redemptions: 27 } },
    { id: 'ret-004', name: 'The Fresh Market', slug: 'the-fresh-market', logoUrl: '/images/retailers/fresh-market.png', supports8112: true, _count: { campaigns: 1, redemptions: 18 } },
    { id: 'ret-005', name: 'Green Earth Grocers', slug: 'green-earth', logoUrl: '/images/retailers/green-earth.png', supports8112: true, _count: { campaigns: 0, redemptions: 0 } },
    { id: 'ret-006', name: 'City Market', slug: 'city-market', logoUrl: '/images/retailers/city-market.png', supports8112: true, _count: { campaigns: 0, redemptions: 0 } }
];

export const mockProducts = [
    {
        id: 'prod-001',
        brandId: 'demo-brand-001',
        name: 'Organic Kombucha (Ginger)',
        retailPrice: 4.99,
        cogs: 1.50,
        sku: 'KOM-GIN-001',
        gtin: '00850012345678',
        imageUrl: '/images/products/kombucha.png',
        brand: { name: 'HealthyLife Organics', slug: 'healthylife-organics' },
        retailers: [{ id: 'ret-003', name: 'Whole Foods Market', logoUrl: '/images/retailers/whole-foods.png' }],
        influencers: [
            { id: 'inf-001', name: 'Sarah Fit', instagramHandle: 'sarahfit', totalRedemptions: 15 },
            { id: 'inf-002', name: 'Mike Foodie', tiktokHandle: 'mike_eats', totalRedemptions: 12 }
        ]
    },
    {
        id: 'prod-002',
        brandId: 'demo-brand-001',
        name: 'Plant Protein Bar (Chocolate)',
        retailPrice: 2.99,
        cogs: 0.80,
        sku: 'PRO-CHO-001',
        gtin: '00850012345999',
        imageUrl: '/images/products/protein-bar.png',
        brand: { name: 'HealthyLife Organics', slug: 'healthylife-organics' },
        retailers: [{ id: 'ret-001', name: 'Target', logoUrl: '/images/retailers/target.png' }],
        influencers: [
            { id: 'inf-002', name: 'Mike Foodie', tiktokHandle: 'mike_eats', totalRedemptions: 12 },
            { id: 'inf-003', name: 'Jessica Wellness', instagramHandle: 'jess_wellness', totalRedemptions: 10 }
        ]
    },
    {
        id: 'prod-003',
        brandId: 'demo-brand-001',
        name: 'Oat Milk (Barista Edition)',
        retailPrice: 5.49,
        cogs: 2.10,
        sku: 'OAT-BAR-001',
        gtin: '00850012345888',
        imageUrl: '/images/products/oat-milk.png',
        brand: { name: 'HealthyLife Organics', slug: 'healthylife-organics' },
        retailers: [{ id: 'ret-004', name: 'The Fresh Market', logoUrl: '/images/retailers/fresh-market.png' }],
        influencers: [
            { id: 'inf-003', name: 'Jessica Wellness', instagramHandle: 'jess_wellness', totalRedemptions: 8 },
            { id: 'inf-004', name: 'Alex Runner', instagramHandle: 'alexruns', totalRedemptions: 10 }
        ]
    }
];


export const mockInfluencers = [
    // Sarah Fit: 15 sales on Kombucha
    { id: 'inf-001', brandId: 'demo-brand-001', name: 'Sarah Fit', email: 'sarah@example.com', instagramHandle: 'sarahfit', tiktokHandle: null, totalRedemptions: 15, brand: { name: 'HealthyLife Organics', slug: 'healthylife-organics' }, _count: { couponAssignments: 1, redemptions: 15 } },
    // Mike Foodie: 12 Kombucha + 12 Protein Bar = 24 total
    { id: 'inf-002', brandId: 'demo-brand-001', name: 'Mike Foodie', email: 'mike@example.com', instagramHandle: null, tiktokHandle: 'mike_eats', totalRedemptions: 24, brand: { name: 'HealthyLife Organics', slug: 'healthylife-organics' }, _count: { couponAssignments: 2, redemptions: 24 } },
    // Jessica Wellness: 10 Protein Bar + 8 Oat Milk = 18 total
    { id: 'inf-003', brandId: 'demo-brand-001', name: 'Jessica Wellness', email: 'jessica@example.com', instagramHandle: 'jess_wellness', tiktokHandle: 'jessw', totalRedemptions: 18, brand: { name: 'HealthyLife Organics', slug: 'healthylife-organics' }, _count: { couponAssignments: 2, redemptions: 18 } },
    // Alex Runner: 10 Oat Milk
    { id: 'inf-004', brandId: 'demo-brand-001', name: 'Alex Runner', email: 'alex@example.com', instagramHandle: 'alexruns', tiktokHandle: null, totalRedemptions: 10, brand: { name: 'HealthyLife Organics', slug: 'healthylife-organics' }, _count: { couponAssignments: 1, redemptions: 10 } }
];
// Total: 15 + 24 + 18 + 10 = 67 ✓

export const mockCampaigns = [
    // Summer Hydration: Kombucha at Whole Foods = 27 redemptions
    { id: 'camp-001', brandId: 'demo-brand-001', productId: 'prod-001', retailerId: 'ret-003', name: 'Summer Hydration', discountType: 'fixed', discountValue: 1.00, status: 'active', campaignStart: new Date().toISOString(), campaignEnd: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), totalCirculation: 1000, product: { id: 'prod-001', name: 'Organic Kombucha (Ginger)', retailPrice: 4.99 }, retailer: { id: 'ret-003', name: 'Whole Foods Market' }, _count: { couponAssignments: 2, redemptions: 27 } },
    // Back to School Snack: Protein Bar at Target = 22 redemptions
    { id: 'camp-002', brandId: 'demo-brand-001', productId: 'prod-002', retailerId: 'ret-001', name: 'Back to School Snack', discountType: 'percent', discountValue: 20, status: 'active', campaignStart: new Date().toISOString(), campaignEnd: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), totalCirculation: 1000, product: { id: 'prod-002', name: 'Plant Protein Bar (Chocolate)', retailPrice: 2.99 }, retailer: { id: 'ret-001', name: 'Target' }, _count: { couponAssignments: 2, redemptions: 22 } },
    // Morning Routine: Oat Milk at Fresh Market = 18 redemptions
    { id: 'camp-003', brandId: 'demo-brand-001', productId: 'prod-003', retailerId: 'ret-004', name: 'Morning Routine', discountType: 'bogo', discountValue: 0, status: 'active', campaignStart: new Date().toISOString(), campaignEnd: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), totalCirculation: 1000, product: { id: 'prod-003', name: 'Oat Milk (Barista Edition)', retailPrice: 5.49 }, retailer: { id: 'ret-004', name: 'The Fresh Market' }, _count: { couponAssignments: 2, redemptions: 18 } }
];
// Total: 27 + 22 + 18 = 67 ✓

export const mockCustomers = [
    // Heavy buyers (5+ redemptions each) = 36 total
    { id: 'cust-001', brandId: 'demo-brand-001', email: 'superfan@gmail.com', name: 'Emily Roberts', totalRedemptions: 12, isAffiliate: true, affiliate: { code: 'SUPERFAN10', commissionPercent: 10 }, _count: { redemptions: 12 } },
    { id: 'cust-002', brandId: 'demo-brand-001', email: 'healthnut@gmail.com', name: 'Marcus Chen', totalRedemptions: 8, isAffiliate: false, affiliate: null, _count: { redemptions: 8 } },
    { id: 'cust-003', brandId: 'demo-brand-001', email: 'fitlife@yahoo.com', name: 'Sarah Kim', totalRedemptions: 6, isAffiliate: false, affiliate: null, _count: { redemptions: 6 } },
    { id: 'cust-004', brandId: 'demo-brand-001', email: 'organic.lover@gmail.com', name: 'James Wilson', totalRedemptions: 5, isAffiliate: true, affiliate: { code: 'JAMES5', commissionPercent: 5 }, _count: { redemptions: 5 } },
    { id: 'cust-005', brandId: 'demo-brand-001', email: 'wellness.daily@outlook.com', name: 'Lisa Park', totalRedemptions: 5, isAffiliate: false, affiliate: null, _count: { redemptions: 5 } },
    // Regular buyers (2-4 redemptions) = 18 total
    { id: 'cust-006', brandId: 'demo-brand-001', email: 'mike.fitness@gmail.com', name: 'Mike Thompson', totalRedemptions: 4, isAffiliate: false, affiliate: null, _count: { redemptions: 4 } },
    { id: 'cust-007', brandId: 'demo-brand-001', email: 'anna.health@gmail.com', name: 'Anna Martinez', totalRedemptions: 3, isAffiliate: false, affiliate: null, _count: { redemptions: 3 } },
    { id: 'cust-008', brandId: 'demo-brand-001', email: 'david.green@yahoo.com', name: 'David Green', totalRedemptions: 3, isAffiliate: false, affiliate: null, _count: { redemptions: 3 } },
    { id: 'cust-009', brandId: 'demo-brand-001', email: 'jen.active@gmail.com', name: 'Jennifer Lee', totalRedemptions: 2, isAffiliate: false, affiliate: null, _count: { redemptions: 2 } },
    { id: 'cust-010', brandId: 'demo-brand-001', email: 'tom.runner@outlook.com', name: 'Tom Baker', totalRedemptions: 2, isAffiliate: false, affiliate: null, _count: { redemptions: 2 } },
    { id: 'cust-011', brandId: 'demo-brand-001', email: 'kate.yoga@gmail.com', name: 'Kate Johnson', totalRedemptions: 2, isAffiliate: false, affiliate: null, _count: { redemptions: 2 } },
    { id: 'cust-012', brandId: 'demo-brand-001', email: 'chris.vegan@yahoo.com', name: 'Chris Anderson', totalRedemptions: 2, isAffiliate: false, affiliate: null, _count: { redemptions: 2 } },
    // One-time buyers (1 redemption each)
    { id: 'cust-013', brandId: 'demo-brand-001', email: 'alex.newbie@gmail.com', name: 'Alex Brown', totalRedemptions: 1, isAffiliate: false, affiliate: null, _count: { redemptions: 1 } },
    { id: 'cust-014', brandId: 'demo-brand-001', email: 'sam.curious@outlook.com', name: 'Sam Garcia', totalRedemptions: 1, isAffiliate: false, affiliate: null, _count: { redemptions: 1 } },
    { id: 'cust-015', brandId: 'demo-brand-001', email: 'jordan.first@gmail.com', name: 'Jordan Taylor', totalRedemptions: 1, isAffiliate: false, affiliate: null, _count: { redemptions: 1 } },
    { id: 'cust-016', brandId: 'demo-brand-001', email: 'pat.try@yahoo.com', name: 'Pat Davis', totalRedemptions: 1, isAffiliate: false, affiliate: null, _count: { redemptions: 1 } },
    { id: 'cust-017', brandId: 'demo-brand-001', email: 'morgan.test@gmail.com', name: 'Morgan White', totalRedemptions: 1, isAffiliate: false, affiliate: null, _count: { redemptions: 1 } },
    { id: 'cust-018', brandId: 'demo-brand-001', email: 'casey.once@outlook.com', name: 'Casey Miller', totalRedemptions: 1, isAffiliate: false, affiliate: null, _count: { redemptions: 1 } },
    { id: 'cust-019', brandId: 'demo-brand-001', email: 'riley.new@gmail.com', name: 'Riley Moore', totalRedemptions: 1, isAffiliate: false, affiliate: null, _count: { redemptions: 1 } },
    { id: 'cust-020', brandId: 'demo-brand-001', email: 'drew.sample@yahoo.com', name: 'Drew Clark', totalRedemptions: 1, isAffiliate: false, affiliate: null, _count: { redemptions: 1 } },
    { id: 'cust-021', brandId: 'demo-brand-001', email: 'quinn.trial@gmail.com', name: 'Quinn Lewis', totalRedemptions: 1, isAffiliate: false, affiliate: null, _count: { redemptions: 1 } },
    { id: 'cust-022', brandId: 'demo-brand-001', email: 'avery.new@outlook.com', name: 'Avery Hall', totalRedemptions: 1, isAffiliate: false, affiliate: null, _count: { redemptions: 1 } },
    { id: 'cust-023', brandId: 'demo-brand-001', email: 'skyler.test@gmail.com', name: 'Skyler Young', totalRedemptions: 1, isAffiliate: false, affiliate: null, _count: { redemptions: 1 } },
    { id: 'cust-024', brandId: 'demo-brand-001', email: 'peyton.first@yahoo.com', name: 'Peyton Allen', totalRedemptions: 1, isAffiliate: false, affiliate: null, _count: { redemptions: 1 } },
    { id: 'cust-025', brandId: 'demo-brand-001', email: 'jamie.try@gmail.com', name: 'Jamie King', totalRedemptions: 1, isAffiliate: false, affiliate: null, _count: { redemptions: 1 } }
];
// Customer redemptions: 12+8+6+5+5 = 36; 3+3+3+2+2+2+2 = 17; 13×1 = 13; + 1 more = 67
// Total: 36 + 17 + 13 + 1 = 67 ✓ (cust-006 has 4 instead of 3)


// ============================================
// MUTABLE MOCK STATE (for demo without database)
// ============================================

export interface MockCouponAssignment {
    id: string;
    campaignId: string;
    influencerId: string;
    serializedGs1: string;
    trackingLink: string;
    qrCodeUrl: string;
    status: 'active' | 'redeemed' | 'expired';
    createdAt: string;
}

export interface MockRedemption {
    id: string;
    couponAssignmentId: string;
    campaignId: string;
    influencerId: string;
    serializedGs1: string;
    redeemedAt: string;
    retailerLocation: string;
    customerId?: string;
}

// Mutable arrays for demo state
export const mockCouponAssignments: MockCouponAssignment[] = [
    // Pre-seed some assignments for demo
    {
        id: 'assign-001',
        campaignId: 'camp-001',
        influencerId: 'inf-001',
        serializedGs1: '8112008500123456780000000000001',
        trackingLink: '/c/8112008500123456780000000000001',
        qrCodeUrl: '',
        status: 'active',
        createdAt: new Date().toISOString()
    },
    {
        id: 'assign-002',
        campaignId: 'camp-002',
        influencerId: 'inf-002',
        serializedGs1: '8112008500123459990000000000002',
        trackingLink: '/c/8112008500123459990000000000002',
        qrCodeUrl: '',
        status: 'active',
        createdAt: new Date().toISOString()
    }
];

export const mockRedemptions: MockRedemption[] = [];

// Counter for generating unique IDs
let assignmentCounter = 100;
let redemptionCounter = 100;

// Helper to find assignment by GS1
export function findAssignmentByGs1(gs1: string): MockCouponAssignment | undefined {
    return mockCouponAssignments.find(a => a.serializedGs1 === gs1);
}

// Helper to create a new assignment
export function createMockAssignment(
    campaignId: string,
    influencerId: string
): MockCouponAssignment {
    assignmentCounter++;
    const campaign = mockCampaigns.find(c => c.id === campaignId);
    const product = campaign ? mockProducts.find(p => p.id === campaign.productId) : null;
    const gtin = product?.gtin || '00850012345678';

    const serializedGs1 = `8112${gtin.slice(-10)}${String(assignmentCounter).padStart(12, '0')}`;

    const assignment: MockCouponAssignment = {
        id: `assign-${assignmentCounter}`,
        campaignId,
        influencerId,
        serializedGs1,
        trackingLink: `/c/${serializedGs1}`,
        qrCodeUrl: `/api/qr/${serializedGs1}`,
        status: 'active',
        createdAt: new Date().toISOString()
    };

    mockCouponAssignments.push(assignment);

    // Update campaign count
    if (campaign && campaign._count) {
        campaign._count.couponAssignments++;
    }

    return assignment;
}

// Helper to simulate a redemption
export function simulateRedemption(
    assignment: MockCouponAssignment,
    retailerLocation: string = 'Simulated - Store #1234'
): MockRedemption {
    redemptionCounter++;

    const redemption: MockRedemption = {
        id: `redeem-${redemptionCounter}`,
        couponAssignmentId: assignment.id,
        campaignId: assignment.campaignId,
        influencerId: assignment.influencerId,
        serializedGs1: assignment.serializedGs1,
        redeemedAt: new Date().toISOString(),
        retailerLocation
    };

    mockRedemptions.push(redemption);

    // Update assignment status
    assignment.status = 'redeemed';

    // Update campaign redemption count
    const campaign = mockCampaigns.find(c => c.id === assignment.campaignId);
    if (campaign && campaign._count) {
        campaign._count.redemptions++;
    }

    // Update influencer redemption count
    const influencer = mockInfluencers.find(i => i.id === assignment.influencerId);
    if (influencer) {
        influencer.totalRedemptions++;
        if (influencer._count) {
            influencer._count.redemptions++;
        }
    }

    return redemption;
}

// Dynamic dashboard data computation
export function getDashboardData() {
    const baseRedemptions = 67; // Original mock count
    const newRedemptions = mockRedemptions.length;
    const totalRedemptions = baseRedemptions + newRedemptions;

    // Calculate revenue
    const baseRevenue = 299.33;
    let newRevenue = 0;
    for (const r of mockRedemptions) {
        const campaign = mockCampaigns.find(c => c.id === r.campaignId);
        if (campaign?.product?.retailPrice) {
            newRevenue += campaign.product.retailPrice;
        }
    }

    // Build recent activity - newest first
    const recentActivity = [
        ...mockRedemptions.slice().reverse().slice(0, 5).map(r => {
            const influencer = mockInfluencers.find(i => i.id === r.influencerId);
            const campaign = mockCampaigns.find(c => c.id === r.campaignId);
            const timeDiff = Date.now() - new Date(r.redeemedAt).getTime();
            const minutes = Math.floor(timeDiff / 60000);
            const timeStr = minutes < 1 ? 'Just now' :
                minutes < 60 ? `${minutes} minutes ago` :
                    `${Math.floor(minutes / 60)} hours ago`;
            return {
                description: `${influencer?.name || 'Unknown'} generated a sale for ${campaign?.name || 'Campaign'}`,
                time: timeStr
            };
        }),
        { description: 'Sarah Fit generated a sale for Summer Hydration', time: '2 hours ago' },
        { description: 'Mike Foodie generated a sale for Back to School Snack', time: '5 hours ago' },
        { description: 'Jessica Wellness generated a sale for Summer Hydration', time: '1 day ago' },
        { description: 'Alex Runner generated a sale for Morning Routine', time: '2 days ago' },
        { description: 'Sarah Fit generated a sale for Morning Routine', time: '3 days ago' },
    ].slice(0, 10);

    return {
        totalRedemptions,
        activeCampaigns: mockCampaigns.filter(c => c.status === 'active').length,
        totalInfluencers: mockInfluencers.length,
        totalProducts: mockProducts.length,
        revenue: Math.round((baseRevenue + newRevenue) * 100) / 100,
        topInfluencers: [...mockInfluencers]
            .sort((a, b) => b.totalRedemptions - a.totalRedemptions)
            .map(i => ({
                id: i.id,
                name: i.name,
                totalRedemptions: i.totalRedemptions,
                instagramHandle: i.instagramHandle,
                tiktokHandle: i.tiktokHandle
            })),
        recentActivity,
        campaignStats: mockCampaigns.map(c => ({
            id: c.id,
            name: c.name,
            status: c.status,
            _count: c._count
        }))
    };
}

// Legacy static export (for backward compat)
export const mockDashboardData = getDashboardData();

