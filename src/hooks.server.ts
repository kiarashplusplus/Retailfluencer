import type { Handle } from '@sveltejs/kit';

// Minimal hooks - no DB initialization at module level
export const handle: Handle = async ({ event, resolve }) => {
    // D1 binding will be available via event.platform.env.DB when needed
    // Each API route will initialize DB client as needed
    return resolve(event);
};
