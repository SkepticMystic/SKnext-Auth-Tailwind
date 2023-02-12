import { auth } from "$lib/auth/lucia";
import { validateOTP } from "$lib/models/OTPs";
import { passwordSchema } from "$lib/schema";
import { Parsers } from "$lib/schema/parsers";
import { INTERNAL_SERVER_ERROR } from "$lib/utils/errors";
import { error, type Actions } from "@sveltejs/kit";
import { z } from "zod";

export const actions: Actions = {
    default: async ({ request, url }) => {
        const { newPass } = await Parsers.form(request, z.object({ newPass: passwordSchema, }))
        const { token } = Parsers.params(url, z.object({ token: z.string() }))

        const check = await validateOTP(token, 'password-reset')
        if (!check.ok) throw error(400, 'Invalid token')

        const { user, otp } = check
        try {
            await auth.updateKeyPassword('email', user.email, newPass)
            await otp.remove()

            return { ok: true }
        } catch (err) {
            console.log(err)
            throw INTERNAL_SERVER_ERROR(err)
        }
    }
}