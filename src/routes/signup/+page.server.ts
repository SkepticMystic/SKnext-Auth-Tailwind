import { auth } from "$lib/auth/lucia";
import { INTERNAL_SERVER_ERROR } from "$lib/utils/errors";
import { type Actions, error, redirect } from "@sveltejs/kit";
import { setCookie } from 'lucia-sveltekit'

export const POST: Actions = {
    default: async ({ request, cookies }) => {
        const form = await request.formData()
        const email = form.get('email') as string
        const password = form.get('password') as string
        if (!email || !password) throw error(400, 'Missing email or password')

        try {
            const { cookies: luciaCookies } = await auth.createUser("email", email, {
                password,
                user_data: { email, roles: [] },
            });

            setCookie(cookies, ...luciaCookies)
        } catch (e) {
            const { message } = e as Error;
            if (
                message === "AUTH_DUPLICATE_IDENTIFIER_TOKEN" ||
                message === "AUTH_DUPLICATE_USER_DATA"
            ) throw error(400, "Email already in use");

            throw INTERNAL_SERVER_ERROR(e)
        }

        throw redirect(302, "/")
    }
};