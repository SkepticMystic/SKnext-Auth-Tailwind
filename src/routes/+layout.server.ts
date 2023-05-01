import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

const anyoneAllowed = [
  "/signup",
  "/signin",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/unverified-email",
];

export const load: LayoutServerLoad = async ({ url, locals }) => {
  const { pathname } = url;

  const onUnauthedRoute = anyoneAllowed.some((route) =>
    pathname.startsWith(route)
  );
  if (onUnauthedRoute) return { user: null };

  const { user } = await locals.validateUser();

  if (!user)
    throw redirect(
      302,
      `/signin?redirect=${encodeURIComponent(url.toString())}`
    );
  const { emailVerified } = user;

  if (!emailVerified) {
    if (pathname.startsWith("/unverified-email")) return { user };
    else throw redirect(302, "/unverified-email");
  }

  return { user };
};
