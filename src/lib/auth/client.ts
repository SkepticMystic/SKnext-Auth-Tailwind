import { signOut } from "lucia-sveltekit/client";

export const signOutUser = async () => {
    try {
        await signOut();
        setLocation()
    } catch (error) {
        console.log(error)
    }
};

export const setLocation = (location = '/') => window.location.href = location;