import { App } from "$lib/utils/app";
import { Roles } from "$lib/utils/roles";
import { Url } from "$lib/utils/urls";
import { error, redirect } from "@sveltejs/kit";
import { type Role } from "./roles";

type GetUserOptions = {
  /** Must have atleast this orgRole */
  role?: Role;
  /** Must be an admin */
  admin?: boolean;
  /** If unauthed, redirect to signin with this url as the redirect param */
  url?: URL;
};

const DEFAULT_OPTIONS: GetUserOptions = {
  admin: false,
  role: undefined,
  url: undefined,
};

/** The catch-all function to get the current user.
 * Check roles.
 * Redirect to signin if not logged in.
 */
export const get_user = async (
  locals: App.Locals,
  options?: GetUserOptions,
) => {
  const { admin, role, url } = Object.assign(
    { ...DEFAULT_OPTIONS },
    options ?? {},
  );

  const session = await locals.auth.validate();
  if (!session) {
    redirect(
      302,
      App.url("/signin", { redirect: url ? Url.strip_origin(url) : "/" }),
    );
  }
  const { user } = session;

  if (admin && !user.admin) {
    error(403, "Forbidden");
  } else if (role && !Roles.has_atleast(user, role)) {
    console.log("role check failed", user, { role });
    error(403, `Forbidden. You must be atleast ${role} to do this.`);
  }

  return user;
};
