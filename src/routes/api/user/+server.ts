import { auth } from "$lib/auth/lucia";
import { INTERNAL_SERVER_ERROR } from "$lib/utils/errors";
import { json, type RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ request }) => {
    try {
        // No role is needed to delete yourself
        const { user } = await auth.validateRequest(request);

        await auth.deleteUser(user.user_id);

        return json({ ok: true })
    } catch (err) {
        console.log(err)
        throw INTERNAL_SERVER_ERROR(err)
    }
}