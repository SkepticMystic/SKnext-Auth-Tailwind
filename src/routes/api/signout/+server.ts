import { auth } from "$lib/auth/lucia";
import { error, redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (!session) throw error(401, "Not logged in");

  await auth.invalidateSession(session.sessionId); // invalidate session
  locals.auth.setSession(null); // remove cookie

  throw redirect(302, "/signin");
};
