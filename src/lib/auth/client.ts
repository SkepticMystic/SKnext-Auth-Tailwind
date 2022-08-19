import { signOut } from "lucia-sveltekit/client";

export const signOutUser = async () => {
    try {
        await signOut();
        window.location.href = "/";
    } catch (error) {
        console.log(error)
    }
};