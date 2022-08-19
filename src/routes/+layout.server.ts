import { redirect, type ServerLoad } from "@sveltejs/kit"

export const load: ServerLoad = async ({ locals, routeId }) => {
    const anyoneAllowed = [
        "signup",
        "signin",
        "forgot-password",
        "reset-password",
        "verify-email",
    ]

    if (anyoneAllowed.some((route) => routeId?.startsWith(route))) return {}

    const { lucia } = locals
    if (!lucia) throw redirect(302, '/signin')
    // This data is merged onto the global $page.data object
    else return { lucia }
}