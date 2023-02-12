import { auth } from "$lib/auth/lucia";
import { ONE_DAY_MS } from "$lib/const";
import { getExistingOrNewOTP } from "$lib/models/OTPs";
import { Parsers } from "$lib/schema/parsers";
import type { Actions } from "@sveltejs/kit";
import { z } from "zod";

export const actions: Actions = {
    default: async ({ request, url }) => {
        const { email } = await Parsers.form(request, z.object({ email: z.string().email() }))

        const { user } = await auth.getKeyUser('email', email)
        if (!user) {
            // Don't reveal whether the email exists or not
            return { ok: true }
        }

        const { userId } = user
        const OTP = await getExistingOrNewOTP({
            userId,
            kind: 'password-reset',
            expiresAt: new Date(Date.now() + ONE_DAY_MS)
        })


        const href = `${url.origin}/reset-password?token=${OTP.token}`
        console.log(href)
        console.log('TODO: sendEmail')

        return { ok: true }
    }
}