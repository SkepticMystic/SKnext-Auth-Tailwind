import { auth } from "$lib/auth/lucia"
import { redirect } from "@sveltejs/kit"
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async (event) => {
    const anyoneAllowed = [
        "signup",
        "signin",
        "forgot-password",
        "reset-password",
        "verify-email",
    ]

    if (anyoneAllowed.some((route) => event.routeId?.startsWith(route))) return {}

    const { lucia } = await auth.load(event)
    if (!lucia) throw redirect(302, '/signin')
    // This data is merged onto the global $page.data object
    else return { lucia }
}