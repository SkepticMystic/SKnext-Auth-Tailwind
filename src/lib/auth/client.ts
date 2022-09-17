import type { Session } from "lucia-sveltekit/types";


export const set_href = (href = '/') => { window.location.href = href };

export const authHeader = (session: Session) => ({
    headers: {
        Authorization: `Bearer ${session?.access_token}`,
    }
})