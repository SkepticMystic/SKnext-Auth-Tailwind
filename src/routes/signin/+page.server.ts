import { auth } from "$lib/auth/lucia";
import { Parsers } from "$lib/schema/parsers";
import { INTERNAL_SERVER_ERROR } from "$lib/utils/errors";
import { type Actions, error, redirect } from "@sveltejs/kit";
import { z } from "zod";

export const actions: Actions = {
  default: async ({ request, locals, url }) => {
    const { email, password } = await Parsers.form(
      request,
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    );

    try {
      const { userId } = await auth.useKey("email", email, password);

      const session = await auth.createSession(userId);
      locals.auth.setSession(session);
    } catch (e) {
      const { message } = e as Error;
      if (
        message === "AUTH_INVALID_KEY_ID" ||
        message === "AUTH_INVALID_PASSWORD"
      ) {
        throw error(400, "Invalid email or password");
      }

      throw INTERNAL_SERVER_ERROR(e);
    }

    throw redirect(302, url.searchParams.get("redirect") ?? "/");
  },
};
