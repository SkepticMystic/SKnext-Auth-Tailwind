import { signOut } from "lucia-sveltekit/client";
import type { Session } from "lucia-sveltekit/types";

export const signOutUser = async (access_token: string | undefined) => {
    if (!access_token) return set_href('/signin');

    try {
        await signOut(access_token);
        return set_href('/signin')
    } catch (error) {
        console.log(error)
    }
};

export const set_href = (href = '/') => { window.location.href = href };

export const authHeader = (session: Session) => ({
    headers: {
        Authorization: `Bearer ${session?.access_token}`,
    }
})