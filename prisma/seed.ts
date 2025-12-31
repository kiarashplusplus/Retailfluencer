import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    // 0. Clear existing data (reverse order of dependencies)
    console.log('Clearing database...');
    try {
        await prisma.redemption.deleteMany({});
        await prisma.couponAssignment.deleteMany({});
        await prisma.campaign.deleteMany({});
        await prisma.product.deleteMany({});
        await prisma.influencer.deleteMany({});
        await prisma.customer.deleteMany({});
        await prisma.brand.deleteMany({});
    } catch (e) {
        console.warn('Error clearing tables (might strictly enforced constraints or empty):', e);
    }

    // 1. Get or Create Brand
    const brandName = 'HealthyLife Organics';
    const brandId = 'demo-brand-001';

    const brand = await prisma.brand.create({
        data: {
            id: brandId,
            name: brandName,
            slug: 'healthylife-organics',
            logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200&h=200',
        }
    });
    console.log('Created Brand:', brand.name);

    // 2. Create Retailers
    const retailers = [
        { name: 'Target', slug: 'target', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Target_logo.svg' },
        { name: 'Walmart', slug: 'walmart', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg' },
        { name: 'Whole Foods', slug: 'whole-foods', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Whole_Foods_Market_201x_logo.svg' }
    ];

    for (const r of retailers) {
        const exists = await prisma.retailer.findUnique({ where: { slug: r.slug } });
        if (!exists) {
            await prisma.retailer.create({ data: r });
            console.log('Created Retailer:', r.name);
        }
    }
    console.log('Retailers ensured');

    // 3. Create Products
    const products = [
        {
            name: 'Organic Kombucha (Ginger)',
            retailPrice: 4.99,
            cogs: 1.50,
            sku: 'KOM-GIN-001',
            gtin: '00850012345678', // Added mock GTIN
            imageUrl: '/images/products/kombucha.png'
        },
        {
            name: 'Plant Protein Bar (Chocolate)',
            retailPrice: 2.99,
            cogs: 0.80,
            sku: 'PRO-CHO-001',
            gtin: '00850012345999',
            imageUrl: '/images/products/protein-bar.png'
        },
        {
            name: 'Oat Milk (Barista Edition)',
            retailPrice: 5.49,
            cogs: 2.10,
            sku: 'OAT-BAR-001',
            gtin: '00850012345888',
            imageUrl: '/images/products/oat-milk.png'
        }
    ];

    const dbProducts = [];
    for (const p of products) {
        let prod = await prisma.product.findFirst({ where: { sku: p.sku, brandId: brand.id } });
        if (!prod) {
            prod = await prisma.product.create({
                data: { ...p, brandId: brand.id }
            });
            console.log('Created Product:', prod.name);
        }
        dbProducts.push(prod);
    }
    console.log('Products ensured');

    // 4. Create Influencers
    const influencers = [
        { name: 'Sarah Fit', instagramHandle: 'sarahfit', email: 'sarah@example.com' },
        { name: 'Mike Foodie', tiktokHandle: 'mike_eats', email: 'mike@example.com' },
        { name: 'Jessica Wellness', instagramHandle: 'jess_wellness', tiktokHandle: 'jessw', email: 'jessica@example.com' },
        { name: 'Alex Runner', instagramHandle: 'alexruns', email: 'alex@example.com' }
    ];

    const dbInfluencers = [];
    for (const inf of influencers) {
        let i = await prisma.influencer.findFirst({ where: { name: inf.name, brandId: brand.id } });
        if (!i) {
            i = await prisma.influencer.create({
                data: { ...inf, brandId: brand.id }
            });
            console.log('Created Influencer:', i.name);
        }
        dbInfluencers.push(i);
    }
    console.log('Influencers ensured');

    // 5. Create Campaigns & Assignments
    const campaigns = [
        { name: 'Summer Hydration', discountType: 'fixed', discountValue: 1.00, productIdx: 0 },
        { name: 'Back to School Snack', discountType: 'percent', discountValue: 20, productIdx: 1 },
        { name: 'Morning Routine', discountType: 'bogo', discountValue: 0, productIdx: 2 }
    ];

    for (const c of campaigns) {
        let camp = await prisma.campaign.findFirst({ where: { name: c.name, brandId: brand.id } });
        if (!camp) {
            camp = await prisma.campaign.create({
                data: {
                    name: c.name,
                    brandId: brand.id,
                    productId: dbProducts[c.productIdx].id,
                    discountType: c.discountType,
                    discountValue: c.discountValue,
                    campaignStart: new Date(),
                    campaignEnd: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days out
                    status: 'active',
                    totalCirculation: 1000
                }
            });
            console.log('Created Campaign:', camp.name);

            // Assign to random influencers
            const assignedInfluencers = dbInfluencers.sort(() => 0.5 - Math.random()).slice(0, 2);

            for (const inf of assignedInfluencers) {
                const assignment = await prisma.couponAssignment.create({
                    data: {
                        campaignId: camp.id,
                        influencerId: inf.id,
                        serializedGs1: `01${dbProducts[c.productIdx].gtin || '00000000000000'}${Date.now().toString().slice(-6)}${Math.random().toString().slice(2, 5)}`,
                        status: 'active'
                    }
                });
                console.log('Assigned coupon to:', inf.name);

                // Simulate Redemptions
                const numRedemptions = Math.floor(Math.random() * 20) + 1; // At least 1
                console.log(`Simulating ${numRedemptions} redemptions for ${inf.name}...`);

                for (let i = 0; i < numRedemptions; i++) {
                    // Random date in last 30 days
                    const daysAgo = Math.floor(Math.random() * 30);
                    const date = new Date();
                    date.setDate(date.getDate() - daysAgo);

                    await prisma.redemption.create({
                        data: {
                            campaignId: camp.id,
                            influencerId: inf.id,
                            couponAssignmentId: assignment.id,
                            serializedGs1: assignment.serializedGs1,
                            redeemedAt: date,
                            retailerLocation: 'Store #1234',
                        }
                    });

                    // Update stats
                    await prisma.influencer.update({
                        where: { id: inf.id },
                        data: { totalRedemptions: { increment: 1 } }
                    });
                }
            }
        } else {
            console.log('Campaign already exists:', camp.name);
        }
    }
    console.log('Campaigns and Redemptions seeded');

    // 6. Create Customers (from automated "capture")
    const customers = [
        { email: 'customer1@gmail.com', redemptions: 3, isAffiliate: false },
        { email: 'customer2@yahoo.com', redemptions: 1, isAffiliate: false },
        { email: 'superfan@gmail.com', redemptions: 12, isAffiliate: true }, // converted
    ];

    for (const cust of customers) {
        let customer = await prisma.customer.findFirst({ where: { email: cust.email, brandId: brand.id } });
        if (!customer) {
            customer = await prisma.customer.create({
                data: {
                    brandId: brand.id,
                    email: cust.email,
                    totalRedemptions: cust.redemptions,
                    isAffiliate: cust.isAffiliate
                }
            });
            console.log('Created Customer:', cust.email);
        }
    }
    console.log('Customers seeded');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
