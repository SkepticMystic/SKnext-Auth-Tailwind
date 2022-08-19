import { auth } from "$lib/auth/lucia";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ request }) => {
    try {
        const { user } = await auth.validateRequest(request);
        console.log(user)

        await auth.deleteUser(user.user_id);

        throw redirect(302, "/signin");
    } catch (error) {
        console.log(error)
        return new Response((<Error>error).message, { status: 500 })
    }
}