import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

const anyoneAllowed = [
  "/signup",
  "/signin",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/unverified-email",
  "/api/team/join",
];

export const load: LayoutServerLoad = async ({ url, locals }) => {
  const { user } = await locals.auth.validateUser();

  const { pathname } = url;

  const onUnauthedRoute = anyoneAllowed.some((route) =>
    pathname.startsWith(route)
  );
  if (onUnauthedRoute) return { user };

  if (!user) {
    throw redirect(
      302,
      `/signin?redirect=${encodeURIComponent(pathname)}`,
    );
  }
  const { emailVerified } = user;

  if (!emailVerified) {
    if (pathname.startsWith("/unverified-email")) return { user };
    else throw redirect(302, "/unverified-email");
  }

  if (pathname.startsWith("/admin") && !user.admin) {
    throw redirect(302, "/");
  }

  return { user };
};
