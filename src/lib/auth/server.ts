import { auth } from "$lib/auth/lucia";
import { FORBIDDEN, UNAUTHORIZED } from "$lib/utils/errors";
import { redirect } from "@sveltejs/kit";
import type { User } from "lucia-sveltekit/types";

export const getSession = (locals: App.Locals) => {
    const session = locals.getSession();
    if (!session) throw redirect(302, '/signin')
    return session;
}

export const hasRole = (user: User, ...roles: string[]) => roles.some(role => user.roles.includes(role))

export const validateRequestByRole = async (
    request: Request,
    options?: {
        roles?: string[],
    }
) => {
    const { roles } = Object.assign({
        roles: ['admin']
    }, options ?? {})

    try {
        const sessionId = auth.parseRequest(request);
        const { user } = await auth.getSessionUser(sessionId);

        if (!hasRole(user, ...roles)) throw FORBIDDEN()

        return user;
    } catch (err) {
        console.log(err)
        throw UNAUTHORIZED()
    }
}