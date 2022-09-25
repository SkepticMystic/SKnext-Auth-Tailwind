import { auth } from "$lib/auth/lucia";
import type { ServerSession, User } from "lucia-sveltekit/types";
import { FORBIDDEN, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "$lib/utils/errors";

export const hasRole = (user: User, ...roles: string[]) => roles.some(role => user.roles.includes(role))

export const validateRequestByRole = async (
    request: Request,
    options?: {
        roles?: string[],
        byCookie?: boolean
    }
): Promise<ServerSession> => {
    const { byCookie, roles } = Object.assign({
        byCookie: false,
        roles: ['admin']
    }, options ?? {})

    try {
        const method = byCookie ? 'validateRequestByCookie' : 'validateRequest'
        const lucia = await auth[method](request.clone());

        if (!lucia) throw UNAUTHORIZED()
        if (!hasRole(lucia.user, ...roles)) throw FORBIDDEN()

        return lucia;
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