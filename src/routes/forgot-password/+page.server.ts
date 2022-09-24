import { auth } from "$lib/auth/lucia";
import { PasswordResetRequests } from "$lib/models/passwordResetRequests";
import { error, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({ request, url }) => {
        const form = await request.formData()
        const email = form.get("email") as string | null
        if (!email) throw error(400, "Email is required")

        const user = await auth.getUser('email', email)
        if (!user) throw error(400, "User not found")
        const { user_id } = user

        let resetRequest = await PasswordResetRequests.findOne({ user_id })
        if (resetRequest) {
            if (resetRequest.expiresAt < new Date()) {
                await resetRequest.remove()
                resetRequest = await PasswordResetRequests.create({ user_id })
            } else throw error(400, "Password reset request already exists")
        } else {
            resetRequest = await PasswordResetRequests.create({ user_id })
        }


        const href = `${url.origin}/reset-password?token=${resetRequest.token}`
        console.log(href)
        // sendEmail()

        return { ok: true }
    }
}