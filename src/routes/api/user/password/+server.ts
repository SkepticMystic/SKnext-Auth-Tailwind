import { auth } from "$lib/auth/lucia";
import { getUser } from "$lib/auth/server";
import { passwordSchema } from "$lib/schema";
import { Parsers } from "$lib/schema/parsers";
import { json, type RequestHandler } from "@sveltejs/kit";
import { z } from "zod";

export const PUT: RequestHandler = async ({ locals, request }) => {
  const [{ email }, { newPass }] = await Promise.all([
    getUser(locals),
    Parsers.request(request, z.object({ newPass: passwordSchema })),
  ]);

  await auth.updateKeyPassword("email", email, newPass);

  return json({ ok: true });
};
