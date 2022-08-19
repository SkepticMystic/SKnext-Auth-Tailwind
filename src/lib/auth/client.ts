import { signOut } from "lucia-sveltekit/client";
import type { Session } from "lucia-sveltekit/types";

export const signOutUser = async () => {
    try {
        await signOut();
        setLocation()
    } catch (error) {
        console.log(error)
    }
};

export const setLocation = (location = '/') => window.location.href = location;

export const authHeader = (session: Session<Lucia.UserData>) => ({
    headers: {
        Authorization: `Bearer ${session?.access_token}`,
    }
})