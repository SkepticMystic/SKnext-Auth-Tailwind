import { redirect } from "@sveltejs/kit";
import type { User } from "lucia-auth/types";
import type { Role } from "./roles";


const hasRole = (user: User, role: Role) => user.roles.includes(role)
export const hasSomeRoles = (user: User, ...roles: Role[]) => roles.some(r => hasRole(user, r))
export const hasAllRoles = (user: User, ...roles: Role[]) => roles.every(r => hasRole(user, r))


interface Options {
    rolesAll?: Role[];
    rolesSome?: Role[];
    url?: URL | string,
}

/** The catch-all function to get the current user.
 * Check roles.
 * Redirect to signin if not logged in.
*/
export const getUser = async (
    locals: App.Locals,
    options?: Options
) => {
    const DEFAULT_OPTIONS: Required<Options> = {
        rolesAll: [],
        rolesSome: [],
        url: "/",
    }
    const { rolesAll, rolesSome, url } = Object.assign(DEFAULT_OPTIONS, options ?? {})

    const { user } = await locals.validateUser()

    if (
        !user ||
        !hasAllRoles(user, ...rolesAll) ||
        (rolesSome.length && !hasSomeRoles(user, ...rolesSome))
    ) throw redirect(302, `/signin?redirect=${encodeURIComponent(url.toString())}`)

    return user;
}