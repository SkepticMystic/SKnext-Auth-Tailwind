import { auth } from "$lib/auth/lucia";
import { getSession } from "$lib/auth/server";
import { passwordSchema } from "$lib/schema";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const PUT: RequestHandler = async ({ locals, request }) => {
    const { userId } = getSession(locals);
    const { newPass } = await request.json();

    const passwordParse = passwordSchema.safeParse(newPass)
    if (!passwordParse.success) throw error(400, passwordParse.error.issues[0].message)

    await auth.updateUserPassword(userId, passwordParse.data);

    return json({ ok: true })
}