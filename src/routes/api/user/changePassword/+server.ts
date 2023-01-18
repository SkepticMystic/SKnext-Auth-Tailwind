import { auth } from "$lib/auth/lucia";
import { getUser } from "$lib/auth/server";
import { passwordSchema } from "$lib/schema";
import { Parsers } from "$lib/schema/parsers";
import { json, type RequestHandler } from "@sveltejs/kit";
import { z } from "zod";

export const PUT: RequestHandler = async ({ locals, request }) => {
    const { userId } = await getUser(locals);
    const { newPass } = await Parsers.request(request, z.object({ newPass: passwordSchema }));

    await auth.updateUserPassword(userId, newPass);

    return json({ ok: true })
}