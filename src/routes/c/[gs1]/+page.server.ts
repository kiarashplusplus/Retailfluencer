import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { mockCampaigns, mockBrand, mockProducts, mockRetailers, findAssignmentByGs1 } from '$lib/mock-data';

export const load: PageServerLoad = async ({ params }) => {
    const gs1 = params.gs1;

    // Try to find the assignment
    const assignment = findAssignmentByGs1(gs1);

    // Determine which campaign to use
    let campaign;
    if (assignment) {
        campaign = mockCampaigns.find(c => c.id === assignment.campaignId);
    }
    // Fallback to first campaign for any GS1 (demo flexibility)
    if (!campaign) {
        campaign = mockCampaigns[0];
    }

    const product = mockProducts.find(p => p.id === campaign.productId);
    const retailer = mockRetailers.find(r => r.id === campaign.retailerId);

    // Generate QR code data URL if not already present
    // Using a simple SVG-based QR placeholder for demo
    const qrCodeUrl = assignment?.qrCodeUrl || generateQrDataUrl(gs1);

    return {
        gs1,
        coupon: {
            id: assignment?.id || `coupon-${gs1}`,
            serializedGs1: gs1,
            status: assignment?.status || 'active',
            qrCodeUrl,
            trackingLink: assignment?.trackingLink || `/c/${gs1}`,
            campaign: {
                ...campaign,
                brand: mockBrand,
                product,
                retailer
            }
        }
    };
};

// Generate a simple QR code SVG as a data URL
function generateQrDataUrl(gs1: string): string {
    // Create a simple visual representation for demo purposes
    // In production, this would use a proper QR library
    const size = 200;
    const cellSize = 8;
    const gridSize = 21; // Standard QR code size

    // Generate a pseudo-random pattern based on GS1
    const seed = gs1.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const cells: boolean[][] = [];

    for (let y = 0; y < gridSize; y++) {
        cells[y] = [];
        for (let x = 0; x < gridSize; x++) {
            // Position detection patterns (corners)
            const isPositionPattern =
                (x < 7 && y < 7) || // Top-left
                (x >= gridSize - 7 && y < 7) || // Top-right
                (x < 7 && y >= gridSize - 7); // Bottom-left

            if (isPositionPattern) {
                // Create the distinctive QR corner pattern
                const inOuter = x === 0 || y === 0 || x === 6 || y === 6 ||
                    x === gridSize - 7 || x === gridSize - 1 ||
                    y === gridSize - 7 || y === gridSize - 1;
                const inInner = (x >= 2 && x <= 4 && y >= 2 && y <= 4) ||
                    (x >= gridSize - 5 && x <= gridSize - 3 && y >= 2 && y <= 4) ||
                    (x >= 2 && x <= 4 && y >= gridSize - 5 && y <= gridSize - 3);
                cells[y][x] = inOuter || inInner;
            } else {
                // Pseudo-random data pattern
                cells[y][x] = ((seed * (x + 1) * (y + 1)) % 7) < 3;
            }
        }
    }

    // Generate SVG
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${gridSize * cellSize} ${gridSize * cellSize}">`;
    svg += `<rect width="100%" height="100%" fill="white"/>`;

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (cells[y][x]) {
                svg += `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
            }
        }
    }

    svg += '</svg>';

    // Use btoa for edge compatibility (Buffer is Node.js only)
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}
