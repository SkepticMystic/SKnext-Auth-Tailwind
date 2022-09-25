import { auth } from "$lib/auth/lucia";
import { json, type RequestHandler } from "@sveltejs/kit";

export const PUT: RequestHandler = async ({ request }) => {
    const { user } = await auth.validateRequest(request);

    const { newPass } = await request.json();

    await auth.resetUserPassword(user.user_id, newPass);

    return json({ ok: true })
}