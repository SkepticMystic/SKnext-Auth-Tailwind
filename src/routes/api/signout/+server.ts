import { auth } from "$lib/auth/lucia";
import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ locals }) => {
  const session = await locals.auth.validate();

  if (session) {
    await auth.invalidateSession(session.sessionId); // invalidate session
  }

  locals.auth.setSession(null);

  redirect(302, "/signin");
};
