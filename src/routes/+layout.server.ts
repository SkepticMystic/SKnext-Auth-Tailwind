import { validateRequestSafe } from "$lib/auth/server";
import { handleServerSession } from "@lucia-auth/sveltekit";
import { redirect } from "@sveltejs/kit";

const anyoneAllowed = [
    "/signup",
    "/signin",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/unverified-email",
]


export const load = handleServerSession(
    async ({ request, url }) => {
        if (anyoneAllowed.some((route) => url.pathname?.startsWith(route))) return {}

        const user = await validateRequestSafe(request);
        if (!user) throw redirect(302, `/signin?redirect=${encodeURIComponent(request.url)}`)

        if (user.emailVerified) return {}
        else throw redirect(302, "/unverified-email")
    }
)