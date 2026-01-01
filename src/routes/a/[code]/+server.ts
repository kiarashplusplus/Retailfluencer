import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, cookies }) => {
    const code = params.code;

    if (!code) {
        throw redirect(303, '/promo');
    }

    // For demo, set the affiliate cookie and redirect
    cookies.set('affiliate_ref', code, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        httpOnly: false
    });

    throw redirect(303, `/promo?ref=${code}`);
};
