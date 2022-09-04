import { signOut } from "lucia-sveltekit/client";
import type { Session } from "lucia-sveltekit/types";

export const signOutUser = async () => {
    try {
        await signOut();
        set_href()
    } catch (error) {
        console.log(error)
    }
};

export const set_href = (href = '/') => window.location.href = href;

export const authHeader = (session: Session) => ({
    headers: {
        Authorization: `Bearer ${session?.access_token}`,
    }
})