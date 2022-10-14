import { auth } from "$lib/auth/lucia";
import { EmailVerificationRequests } from "$lib/models/emailVerifications";
import { isValidEmail } from "$lib/schema";
import { passwordSchema } from '$lib/schema/index';
import { INTERNAL_SERVER_ERROR } from "$lib/utils/errors";
import { error, redirect, type Actions } from "@sveltejs/kit";
import { setCookie } from 'lucia-sveltekit';

const sendEmailVerificationLink = async (user_id: string, origin: string) => {
    const request = await EmailVerificationRequests.create({ userId: user_id })
    const href = `${origin}/api/verify-email?token=${request.token}`
    console.log(href)
    console.log("TODO: sendEmail")
}

export const actions: Actions = {
    default: async ({ request, cookies, url }) => {
        const form = await request.formData()
        const email = form.get('email') as string
        const password = form.get('password') as string
        if (!email || !password) throw error(400, 'Missing email or password')

        if (!isValidEmail(email)) throw error(400, 'Invalid email')

        const passwordParse = passwordSchema.safeParse(password)
        if (!passwordParse.success) throw error(400, passwordParse.error.issues[0].message)

        try {
            const user = await auth.createUser("email", email, {
                password,
                userData: {
                    email,
                    roles: [],
                    emailVerified: false
                },
            });

            await sendEmailVerificationLink(user.userId, url.origin)

            const { tokens } = await auth.createSession(user.userId)
            setCookie(cookies, ...tokens.cookies)
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