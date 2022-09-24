import { auth } from "$lib/auth/lucia"
import { redirect } from "@sveltejs/kit"

const anyoneAllowed = [
    "signup",
    "signin",
    "forgot-password",
    "reset-password",
    "verify-email",
]

export const load = auth.handleServerSession(
    async ({ request, routeId }) => {
        try {
            const session = await auth.validateRequestByCookie(request)
            return {}
        } catch (error) {
            if (anyoneAllowed.some((route) => routeId?.startsWith(route))) return {}
            else throw redirect(302, "/signin")
        }
    })