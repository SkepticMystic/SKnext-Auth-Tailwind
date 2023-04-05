import { error, redirect } from "@sveltejs/kit";
import type { User } from "lucia-auth";
import { Users } from "./lucia";
import { OrgRoleHierarchy, type OrgRole, type Role } from "./roles";

const hasRole = (user: User, role: Role) => user.roles.includes(role);

export const hasAtleastRole = (user: User, role: OrgRole) => {
    const orgRole = user.roles.find((r) => r.startsWith("org:"));
    if (!orgRole) return false;

    return OrgRoleHierarchy[<OrgRole>orgRole] >= OrgRoleHierarchy[role];
};


export interface GetUserOptions {
    /** Must have atleast this orgRole */
    role?: OrgRole | undefined;
    /** Must be an admin */
    admin?: boolean;
    /** If unauthed, redirect to signin with this url as the redirect param */
    url?: URL;
}

const DEFAULT_OPTIONS: GetUserOptions = {
    admin: false,
    role: undefined,
    url: undefined,
};

/** The catch-all function to get the current user.
 * Check roles.
 * Redirect to signin if not logged in.
*/
export const getUser = async (locals: App.Locals, options?: GetUserOptions) => {
    const { admin, role, url } = Object.assign(
        { ...DEFAULT_OPTIONS },
        options ?? {}
    );

    const { user } = await locals.validateUser();

    if (!user) throw redirect(302, `/signin?redirect=${url?.pathname ?? "/"}`);

    if (admin && !hasRole(user, "admin")) throw error(403, "Forbidden");

    if (role && !hasAtleastRole(user, role)) {
        console.log("role check failed", user, { role });
        throw error(403, `Forbidden. You must be atleast ${role} to do this.`);
    }

    return user;
};

export const getUserByEmail = async (email: string) => {
    let user = null
    try {
        user = await Users.findOne({ email }).lean()
    } catch {
        user = null;
    }
    return user;
};