import { auth } from "$lib/auth/lucia";
import { validateRequest } from "$lib/auth/server";
import { parseRequestAs, passwordSchema } from "$lib/schema";
import { json, type RequestHandler } from "@sveltejs/kit";
import { z } from "zod";

export const PUT: RequestHandler = async ({ locals, request }) => {
    const { userId } = await validateRequest(request);

    const { newPass } = await parseRequestAs(request, z.object({ newPass: passwordSchema }));

    await auth.updateUserPassword(userId, newPass);

    return json({ ok: true })
}