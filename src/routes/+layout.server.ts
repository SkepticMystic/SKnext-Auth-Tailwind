import { auth } from "$lib/auth/lucia";
import { getSession } from "$lib/auth/server";
import type { Redirect } from '$lib/interfaces';
import { redirect } from "@sveltejs/kit";

const anyoneAllowed = [
    "signup",
    "signin",
    "forgot-password",
    "reset-password",
    "verify-email",
    "unverified-email",
]

const isRedirect = (err: unknown): err is Redirect => {
    if (typeof err === "object" && err !== null) {
        const { status, location } = err as Redirect
        return typeof status === "number" && typeof location === "string"
    } else return false
}


export const load = auth.handleServerSession(
    async ({ routeId, locals }) => {
        if (anyoneAllowed.some((route) => routeId?.startsWith(route))) return {}

        try {
            const { sessionId } = getSession(locals);
            const { user } = await auth.getSessionUser(sessionId);

            if (user.emailVerified) return { user }
            else throw redirect(302, "/unverified-email")
        } catch (error) {
            if (isRedirect(error)) throw redirect(302, error.location)
            else throw redirect(302, "/signin")
        }
    }
)