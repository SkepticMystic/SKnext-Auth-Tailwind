import { auth } from "$lib/auth/lucia";
import { PasswordResetRequests } from "$lib/models/passwordResetRequests";
import { Parsers } from "$lib/schema/parsers";
import { error, type Actions } from "@sveltejs/kit";
import { z } from "zod";

export const actions: Actions = {
    default: async ({ request, url }) => {
        const { email } = await Parsers.form(request, z.object({ email: z.string().email() }))

        const user = await auth.getUserByProviderId('email', email)
        if (!user) throw error(400, "User not found")
        const { userId } = user

        let resetRequest = await PasswordResetRequests.findOne({ userId })
        if (resetRequest) {
            if (resetRequest.expiresAt < new Date()) {
                await resetRequest.remove()
                resetRequest = await PasswordResetRequests.create({ userId })
            } else throw error(400, "Password reset request already exists")
        } else {
            resetRequest = await PasswordResetRequests.create({ userId })
        }


        const href = `${url.origin}/reset-password?token=${resetRequest.token}`
        console.log(href)
        console.log('TODO: sendEmail')

        return { ok: true }
    }
}