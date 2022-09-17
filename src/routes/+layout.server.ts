import { auth } from "$lib/auth/lucia"
import { redirect } from "@sveltejs/kit"
import { handleSession } from "lucia-sveltekit"
import type { LayoutServerLoad } from './$types'

export const load = auth.handleServerLoad(
    handleSession(),
    async ({ routeId, getSession }) => {
        const anyoneAllowed = [
            "signup",
            "signin",
            "forgot-password",
            "reset-password",
            "verify-email",
        ]


        const session = await getSession()
        if (!session) {
            if (anyoneAllowed.some((route) => routeId?.startsWith(route))) return {}
            else throw redirect(302, "/signin")
        } else return {}
    })