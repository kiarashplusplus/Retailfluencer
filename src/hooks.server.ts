import type { Handle } from '@sveltejs/kit';

// Minimal hooks - no DB initialization
export const handle: Handle = async ({ event, resolve }) => {
    return resolve(event);
};
