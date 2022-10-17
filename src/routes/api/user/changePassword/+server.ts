import { auth } from "$lib/auth/lucia";
import { passwordSchema } from "$lib/schema";
import { error, json, type RequestHandler } from "@sveltejs/kit";

export const PUT: RequestHandler = async ({ request, cookies }) => {
    const { userId } = await auth.validateRequestEvent({ request, cookies });

    const { newPass } = await request.json();

    const passwordParse = passwordSchema.safeParse(newPass)
    if (!passwordParse.success) throw error(400, passwordParse.error.issues[0].message)

    await auth.updateUserPassword(userId, passwordParse.data);

    return json({ ok: true })
}