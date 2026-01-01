import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, cookies, locals }) => {
    const code = params.code;

    if (!code) {
        throw redirect(303, '/promo');
    }

    const affiliate = await locals.db.affiliate.findUnique({
        where: { code }
    });

    if (affiliate) {
        // Find a recent campaign or just redirect to promo page
        // Set a cookie to track the affiliate
        cookies.set('affiliate_ref', code, {
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            httpOnly: false // Allow client to read if needed
        });

        // Redirect to promo page with ref param for visibility
        throw redirect(303, `/promo?ref=${code}`);
    }

    // If invalid code, just redirect to promo without ref
    throw redirect(303, '/promo');
};
