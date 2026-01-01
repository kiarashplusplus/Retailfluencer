-- Seed data for Retailfluencer D1 database
-- Generated from prisma/seed.ts

-- 1. Create Brand
INSERT INTO "Brand" ("id", "name", "slug", "logoUrl", "createdAt", "updatedAt") VALUES
('demo-brand-001', 'HealthyLife Organics', 'healthylife-organics', 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=200&h=200', datetime('now'), datetime('now'));

-- 2. Create Retailers
INSERT INTO "Retailer" ("id", "name", "slug", "logoUrl", "supports8112", "createdAt", "updatedAt") VALUES
('ret-001', 'Target', 'target', '/images/retailers/target.png', 1, datetime('now'), datetime('now')),
('ret-002', 'Walmart', 'walmart', '/images/retailers/walmart.png', 1, datetime('now'), datetime('now')),
('ret-003', 'Whole Foods Market', 'whole-foods', '/images/retailers/whole-foods.png', 1, datetime('now'), datetime('now')),
('ret-004', 'The Fresh Market', 'the-fresh-market', '/images/retailers/fresh-market.png', 1, datetime('now'), datetime('now')),
('ret-005', 'Green Earth Grocers', 'green-earth', '/images/retailers/green-earth.png', 1, datetime('now'), datetime('now')),
('ret-006', 'City Market', 'city-market', '/images/retailers/city-market.png', 1, datetime('now'), datetime('now'));

-- 3. Create Products
INSERT INTO "Product" ("id", "brandId", "name", "retailPrice", "cogs", "sku", "gtin", "imageUrl", "createdAt", "updatedAt") VALUES
('prod-001', 'demo-brand-001', 'Organic Kombucha (Ginger)', 4.99, 1.50, 'KOM-GIN-001', '00850012345678', '/images/products/kombucha.png', datetime('now'), datetime('now')),
('prod-002', 'demo-brand-001', 'Plant Protein Bar (Chocolate)', 2.99, 0.80, 'PRO-CHO-001', '00850012345999', '/images/products/protein-bar.png', datetime('now'), datetime('now')),
('prod-003', 'demo-brand-001', 'Oat Milk (Barista Edition)', 5.49, 2.10, 'OAT-BAR-001', '00850012345888', '/images/products/oat-milk.png', datetime('now'), datetime('now'));

-- 4. Create Influencers
INSERT INTO "Influencer" ("id", "brandId", "name", "email", "instagramHandle", "tiktokHandle", "totalRedemptions", "createdAt", "updatedAt") VALUES
('inf-001', 'demo-brand-001', 'Sarah Fit', 'sarah@example.com', 'sarahfit', NULL, 15, datetime('now'), datetime('now')),
('inf-002', 'demo-brand-001', 'Mike Foodie', 'mike@example.com', NULL, 'mike_eats', 22, datetime('now'), datetime('now')),
('inf-003', 'demo-brand-001', 'Jessica Wellness', 'jessica@example.com', 'jess_wellness', 'jessw', 18, datetime('now'), datetime('now')),
('inf-004', 'demo-brand-001', 'Alex Runner', 'alex@example.com', 'alexruns', NULL, 12, datetime('now'), datetime('now'));

-- 5. Create Campaigns
INSERT INTO "Campaign" ("id", "brandId", "productId", "retailerId", "name", "discountType", "discountValue", "campaignStart", "campaignEnd", "status", "totalCirculation", "createdAt", "updatedAt") VALUES
('camp-001', 'demo-brand-001', 'prod-001', 'ret-003', 'Summer Hydration', 'fixed', 1.00, datetime('now'), datetime('now', '+90 days'), 'active', 1000, datetime('now'), datetime('now')),
('camp-002', 'demo-brand-001', 'prod-002', 'ret-001', 'Back to School Snack', 'percent', 20, datetime('now'), datetime('now', '+90 days'), 'active', 1000, datetime('now'), datetime('now')),
('camp-003', 'demo-brand-001', 'prod-003', 'ret-004', 'Morning Routine', 'bogo', 0, datetime('now'), datetime('now', '+90 days'), 'active', 1000, datetime('now'), datetime('now'));

-- 6. Create Coupon Assignments
INSERT INTO "CouponAssignment" ("id", "campaignId", "influencerId", "serializedGs1", "status", "createdAt", "updatedAt") VALUES
('assign-001', 'camp-001', 'inf-001', '0100850012345678173512310001', 'active', datetime('now'), datetime('now')),
('assign-002', 'camp-001', 'inf-003', '0100850012345678173512310002', 'active', datetime('now'), datetime('now')),
('assign-003', 'camp-002', 'inf-002', '0100850012345999173512310003', 'active', datetime('now'), datetime('now')),
('assign-004', 'camp-002', 'inf-004', '0100850012345999173512310004', 'active', datetime('now'), datetime('now')),
('assign-005', 'camp-003', 'inf-001', '0100850012345888173512310005', 'active', datetime('now'), datetime('now')),
('assign-006', 'camp-003', 'inf-002', '0100850012345888173512310006', 'active', datetime('now'), datetime('now'));

-- 7. Create Redemptions (sample data for analytics)
INSERT INTO "Redemption" ("id", "couponAssignmentId", "campaignId", "influencerId", "serializedGs1", "redeemedAt", "retailerLocation", "createdAt") VALUES
('red-001', 'assign-001', 'camp-001', 'inf-001', '0100850012345678173512310001', datetime('now', '-5 days'), 'Store #1234', datetime('now')),
('red-002', 'assign-001', 'camp-001', 'inf-001', '0100850012345678173512310001', datetime('now', '-10 days'), 'Store #5678', datetime('now')),
('red-003', 'assign-001', 'camp-001', 'inf-001', '0100850012345678173512310001', datetime('now', '-15 days'), 'Store #9012', datetime('now')),
('red-004', 'assign-002', 'camp-001', 'inf-003', '0100850012345678173512310002', datetime('now', '-3 days'), 'Store #1234', datetime('now')),
('red-005', 'assign-002', 'camp-001', 'inf-003', '0100850012345678173512310002', datetime('now', '-7 days'), 'Store #5678', datetime('now')),
('red-006', 'assign-003', 'camp-002', 'inf-002', '0100850012345999173512310003', datetime('now', '-2 days'), 'Store #3456', datetime('now')),
('red-007', 'assign-003', 'camp-002', 'inf-002', '0100850012345999173512310003', datetime('now', '-8 days'), 'Store #7890', datetime('now')),
('red-008', 'assign-003', 'camp-002', 'inf-002', '0100850012345999173512310003', datetime('now', '-12 days'), 'Store #3456', datetime('now')),
('red-009', 'assign-004', 'camp-002', 'inf-004', '0100850012345999173512310004', datetime('now', '-4 days'), 'Store #7890', datetime('now')),
('red-010', 'assign-005', 'camp-003', 'inf-001', '0100850012345888173512310005', datetime('now', '-1 days'), 'Store #2345', datetime('now')),
('red-011', 'assign-005', 'camp-003', 'inf-001', '0100850012345888173512310005', datetime('now', '-6 days'), 'Store #6789', datetime('now')),
('red-012', 'assign-006', 'camp-003', 'inf-002', '0100850012345888173512310006', datetime('now', '-9 days'), 'Store #2345', datetime('now'));

-- 8. Create Customers
INSERT INTO "Customer" ("id", "brandId", "email", "totalRedemptions", "isAffiliate", "createdAt", "updatedAt") VALUES
('cust-001', 'demo-brand-001', 'customer1@gmail.com', 3, 0, datetime('now'), datetime('now')),
('cust-002', 'demo-brand-001', 'customer2@yahoo.com', 1, 0, datetime('now'), datetime('now')),
('cust-003', 'demo-brand-001', 'superfan@gmail.com', 12, 1, datetime('now'), datetime('now'));
