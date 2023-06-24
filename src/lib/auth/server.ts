import { error, redirect } from "@sveltejs/kit";
import { type Role, ROLES } from "./roles";

export const hasAtleastRole = (
  user: Lucia.DatabaseUserAttributes,
  role: Role,
) => {
  const hasRoleIndex = ROLES.indexOf(user.role);
  const atleastRoleIndex = ROLES.indexOf(role);

  if (hasRoleIndex === -1 || atleastRoleIndex === -1) {
    throw new Error(`Role ${role} not found in ROLES`);
  }

  return hasRoleIndex >= atleastRoleIndex;
};

export interface GetUserOptions {
  /** Must have atleast this orgRole */
  role?: Role;
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
    options ?? {},
  );

  const session = await locals.auth.validate();
  if (!session) throw redirect(302, `/signin?redirect=${url?.pathname ?? "/"}`);
  const { user } = session;

  if (admin && !user.admin) throw error(403, "Forbidden");

  if (role && !hasAtleastRole(user, role)) {
    console.log("role check failed", user, { role });
    throw error(403, `Forbidden. You must be atleast ${role} to do this.`);
  }

  return user;
};
