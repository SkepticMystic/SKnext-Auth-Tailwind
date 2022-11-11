import { getUser } from "$lib/auth/server";
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
    async ({ url, locals }) => {
        const onUnauthedRoute = anyoneAllowed.some((route) => url.pathname.startsWith(route))
        if (onUnauthedRoute) return {}

        const user = await getUser(locals, { url })
        console.log({ user })

        if (user.emailVerified) return {}
        else throw redirect(302, "/unverified-email")
    }
)