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
    { id: 'ret-001', name: 'Target', slug: 'target', logoUrl: '/images/retailers/target.png', supports8112: true, _count: { campaigns: 1, redemptions: 4 } },
    { id: 'ret-002', name: 'Walmart', slug: 'walmart', logoUrl: '/images/retailers/walmart.png', supports8112: true, _count: { campaigns: 0, redemptions: 0 } },
    { id: 'ret-003', name: 'Whole Foods Market', slug: 'whole-foods', logoUrl: '/images/retailers/whole-foods.png', supports8112: true, _count: { campaigns: 1, redemptions: 5 } },
    { id: 'ret-004', name: 'The Fresh Market', slug: 'the-fresh-market', logoUrl: '/images/retailers/fresh-market.png', supports8112: true, _count: { campaigns: 1, redemptions: 3 } },
    { id: 'ret-005', name: 'Green Earth Grocers', slug: 'green-earth', logoUrl: '/images/retailers/green-earth.png', supports8112: true, _count: { campaigns: 0, redemptions: 0 } },
    { id: 'ret-006', name: 'City Market', slug: 'city-market', logoUrl: '/images/retailers/city-market.png', supports8112: true, _count: { campaigns: 0, redemptions: 0 } }
];

export const mockProducts = [
    { id: 'prod-001', brandId: 'demo-brand-001', name: 'Organic Kombucha (Ginger)', retailPrice: 4.99, cogs: 1.50, sku: 'KOM-GIN-001', gtin: '00850012345678', imageUrl: '/images/products/kombucha.png', brand: { name: 'HealthyLife Organics', slug: 'healthylife-organics' } },
    { id: 'prod-002', brandId: 'demo-brand-001', name: 'Plant Protein Bar (Chocolate)', retailPrice: 2.99, cogs: 0.80, sku: 'PRO-CHO-001', gtin: '00850012345999', imageUrl: '/images/products/protein-bar.png', brand: { name: 'HealthyLife Organics', slug: 'healthylife-organics' } },
    { id: 'prod-003', brandId: 'demo-brand-001', name: 'Oat Milk (Barista Edition)', retailPrice: 5.49, cogs: 2.10, sku: 'OAT-BAR-001', gtin: '00850012345888', imageUrl: '/images/products/oat-milk.png', brand: { name: 'HealthyLife Organics', slug: 'healthylife-organics' } }
];

export const mockInfluencers = [
    { id: 'inf-001', brandId: 'demo-brand-001', name: 'Sarah Fit', email: 'sarah@example.com', instagramHandle: 'sarahfit', tiktokHandle: null, totalRedemptions: 15, brand: { name: 'HealthyLife Organics', slug: 'healthylife-organics' }, _count: { couponAssignments: 2, redemptions: 15 } },
    { id: 'inf-002', brandId: 'demo-brand-001', name: 'Mike Foodie', email: 'mike@example.com', instagramHandle: null, tiktokHandle: 'mike_eats', totalRedemptions: 22, brand: { name: 'HealthyLife Organics', slug: 'healthylife-organics' }, _count: { couponAssignments: 2, redemptions: 22 } },
    { id: 'inf-003', brandId: 'demo-brand-001', name: 'Jessica Wellness', email: 'jessica@example.com', instagramHandle: 'jess_wellness', tiktokHandle: 'jessw', totalRedemptions: 18, brand: { name: 'HealthyLife Organics', slug: 'healthylife-organics' }, _count: { couponAssignments: 1, redemptions: 18 } },
    { id: 'inf-004', brandId: 'demo-brand-001', name: 'Alex Runner', email: 'alex@example.com', instagramHandle: 'alexruns', tiktokHandle: null, totalRedemptions: 12, brand: { name: 'HealthyLife Organics', slug: 'healthylife-organics' }, _count: { couponAssignments: 1, redemptions: 12 } }
];

export const mockCampaigns = [
    { id: 'camp-001', brandId: 'demo-brand-001', productId: 'prod-001', retailerId: 'ret-003', name: 'Summer Hydration', discountType: 'fixed', discountValue: 1.00, status: 'active', campaignStart: new Date().toISOString(), campaignEnd: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), totalCirculation: 1000, product: { id: 'prod-001', name: 'Organic Kombucha (Ginger)' }, retailer: { id: 'ret-003', name: 'Whole Foods Market' }, _count: { couponAssignments: 2, redemptions: 5 } },
    { id: 'camp-002', brandId: 'demo-brand-001', productId: 'prod-002', retailerId: 'ret-001', name: 'Back to School Snack', discountType: 'percent', discountValue: 20, status: 'active', campaignStart: new Date().toISOString(), campaignEnd: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), totalCirculation: 1000, product: { id: 'prod-002', name: 'Plant Protein Bar (Chocolate)' }, retailer: { id: 'ret-001', name: 'Target' }, _count: { couponAssignments: 2, redemptions: 4 } },
    { id: 'camp-003', brandId: 'demo-brand-001', productId: 'prod-003', retailerId: 'ret-004', name: 'Morning Routine', discountType: 'bogo', discountValue: 0, status: 'active', campaignStart: new Date().toISOString(), campaignEnd: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), totalCirculation: 1000, product: { id: 'prod-003', name: 'Oat Milk (Barista Edition)' }, retailer: { id: 'ret-004', name: 'The Fresh Market' }, _count: { couponAssignments: 2, redemptions: 3 } }
];

export const mockCustomers = [
    { id: 'cust-001', brandId: 'demo-brand-001', email: 'customer1@gmail.com', totalRedemptions: 3, isAffiliate: false, affiliate: null, _count: { redemptions: 3 } },
    { id: 'cust-002', brandId: 'demo-brand-001', email: 'customer2@yahoo.com', totalRedemptions: 1, isAffiliate: false, affiliate: null, _count: { redemptions: 1 } },
    { id: 'cust-003', brandId: 'demo-brand-001', email: 'superfan@gmail.com', totalRedemptions: 12, isAffiliate: true, affiliate: { code: 'SUPERFAN10', commissionPercent: 10 }, _count: { redemptions: 12 } }
];

export const mockDashboardData = {
    totalRedemptions: 67,
    activeCampaigns: 3,
    totalInfluencers: 4,
    topInfluencers: mockInfluencers.map(i => ({
        id: i.id,
        name: i.name,
        totalRedemptions: i.totalRedemptions,
        instagramHandle: i.instagramHandle,
        tiktokHandle: i.tiktokHandle
    })),
    recentActivity: [
        { description: 'Sarah Fit generated a sale for Summer Hydration', time: '2 hours ago' },
        { description: 'Mike Foodie generated a sale for Back to School Snack', time: '5 hours ago' },
        { description: 'Jessica Wellness generated a sale for Summer Hydration', time: '1 day ago' },
        { description: 'Alex Runner generated a sale for Morning Routine', time: '2 days ago' },
        { description: 'Sarah Fit generated a sale for Morning Routine', time: '3 days ago' },
    ],
    campaignStats: mockCampaigns.map(c => ({
        id: c.id,
        name: c.name,
        status: c.status,
        _count: c._count
    }))
};
