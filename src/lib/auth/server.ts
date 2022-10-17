import { auth } from "$lib/auth/lucia";
import { FORBIDDEN, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "$lib/utils/errors";
import type { User } from "lucia-sveltekit/types";

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