import { auth } from "$lib/auth/lucia";
import { PasswordResetRequests } from "$lib/models/passwordResetRequests";
import { parseInputAs, passwordSchema } from "$lib/schema";
import { INTERNAL_SERVER_ERROR } from "$lib/utils/errors";
import { error, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    default: async ({ request, url }) => {
        const form = await request.formData()
        const newPass = form.get("newPass") as string | null
        const token = url.searchParams.get("token") as string | null;

        if (!newPass) throw error(400, "New password is required")
        if (!token) throw error(400, "Token is required")

        const passwordParse = parseInputAs(newPass, passwordSchema);

        const resetRequest = await PasswordResetRequests.findOne({ token }).exec()
        if (!resetRequest) throw error(400, "Invalid token")
        if (resetRequest.expiresAt < new Date()) {
            await resetRequest.remove()
            throw error(400, "Token expired")
        }

        try {
            await auth.updateUserPassword(resetRequest.userId, newPass)
            await resetRequest.remove()

            return { ok: true }
        } catch (err) {
            console.log(err)
            throw INTERNAL_SERVER_ERROR(err)
        }
    }
}