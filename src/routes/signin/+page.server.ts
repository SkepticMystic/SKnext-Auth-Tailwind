import { auth } from "$lib/auth/lucia";
import { parseFormRequestAs } from "$lib/schema";
import { INTERNAL_SERVER_ERROR } from "$lib/utils/errors";
import { error, redirect, type Actions } from "@sveltejs/kit";
import { z } from "zod";

export const actions: Actions = {
    default: async ({ request, locals, url }) => {
        const { email, password } = await parseFormRequestAs(request, z.object({
            email: z.string().email(),
            password: z.string()
        }))

        try {
            const user = await auth.authenticateUser(
                "email",
                email,
                password
            );


            const session = await auth.createSession(user.userId)
            locals.setSession(session)
        } catch (e) {
            const { message } = e as Error;
            if (
                message === "AUTH_INVALID_PROVIDER_ID" ||
                message === "AUTH_INVALID_PASSWORD"
            ) throw error(400, "Invalid email or password");

            throw INTERNAL_SERVER_ERROR(e)
        }

        throw redirect(302, url.searchParams.get('redirect') ?? '/')
    }
};