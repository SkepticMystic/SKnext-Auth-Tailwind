import { auth } from "$lib/auth/lucia";
import type { User } from "lucia-sveltekit/types";
import { FORBIDDEN, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "$lib/utils/errors";

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
        const { accessToken } = await auth.parseRequest(request);
        const user = await auth.getSessionUser(accessToken);

        if (!hasRole(user, ...roles)) throw FORBIDDEN()

        return user;
    } catch (err) {
        console.log(err)
        const { message } = err as Error;
        if (
            message === "AUTH_INVALID_ACCESS_TOKEN" ||
            message === "AUTH_INVALID_REFRESH_TOKEN"
        ) throw UNAUTHORIZED()
        else throw INTERNAL_SERVER_ERROR(message)
    }
}