import { auth } from "$lib/auth/lucia";
import { get_user } from "$lib/auth/server";
import { password_schema } from "$lib/schema";
import { Parsers } from "$lib/schema/parsers";
import { json, type RequestHandler } from "@sveltejs/kit";
import { z } from "zod";

export const PUT: RequestHandler = async ({ locals, request }) => {
  const [{ email }, { newPass }] = await Promise.all([
    get_user(locals),
    Parsers.request(request, z.object({ newPass: password_schema })),
  ]);

  await auth.updateKeyPassword("email", email, newPass);

  return json({ ok: true });
};
