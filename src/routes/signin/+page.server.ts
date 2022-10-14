import { auth } from "$lib/auth/lucia";
import { isValidEmail } from "$lib/schema";
import { INTERNAL_SERVER_ERROR } from "$lib/utils/errors";
import { error, redirect, type Actions } from "@sveltejs/kit";
import { setCookie } from "lucia-sveltekit";

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const form = await request.formData()
        const email = form.get('email') as string
        const password = form.get('password') as string
        if (!email || !password) throw error(400, 'Missing email or password')

        if (!isValidEmail(email)) throw error(400, 'Invalid email')

        try {
            const user = await auth.authenticateUser(
                "email",
                email,
                password
            );

            const { tokens } = await auth.createSession(user.userId)
            setCookie(cookies, ...tokens.cookies)
        } catch (e) {
            const { message } = e as Error;
            if (
                message === "AUTH_INVALID_IDENTIFIER_TOKEN" ||
                message === "AUTH_INVALID_PASSWORD"
            ) throw error(400, "Invalid email or password");

            throw INTERNAL_SERVER_ERROR(e)
        }

        throw redirect(302, "/")
    }
};