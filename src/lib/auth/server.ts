import { auth } from "$lib/auth/lucia";
import { FORBIDDEN, INTERNAL_SERVER_ERROR, UNAUTHORIZED } from "$lib/utils/errors";
import { redirect } from "@sveltejs/kit";
import type { User } from "lucia-auth/types";

export const getSession = async (locals: App.Locals) => {
    const session = await locals.getSession();
    if (!session) throw redirect(302, '/signin')
    return session;
}

export const hasSomeRoles = (user: User, ...roles: string[]) => roles.some(
    role => user.roles.includes(role)
)
export const hasAllRoles = (user: User, ...roles: string[]) => roles.every(
    role => user.roles.includes(role)
)

const getSessionUser = async (request: Request) => {
    const sessionId = auth.parseRequest(request);
    const { user } = await auth.getSessionUser(sessionId);
    return user
}

export const validateRequest = async (request: Request) => {
    try {
        return await getSessionUser(request);
    } catch (error) {
        if ((<Error>error).message === 'AUTH_INVALID_SESSION_ID') throw redirect(302, `/signin?redirect=${request.url}`);
        else throw INTERNAL_SERVER_ERROR(error)
    }
}

export const validateRequestSafe = async (request: Request) => {
    try {
        return await getSessionUser(request);
    } catch (error) {
        return null
    }
}

export const validateRequestByRole = async (
    request: Request,
    options?: {
        roles?: string[],
    }
) => {
    const { roles } = Object.assign({
        roles: ['admin']
    }, options ?? {})

    const user = await validateRequestSafe(request);

    if (!user) throw UNAUTHORIZED()
    if (!hasSomeRoles(user, ...roles)) throw FORBIDDEN()
    return user;
}