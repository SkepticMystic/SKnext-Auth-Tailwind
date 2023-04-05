import { getUserByEmail } from "$lib/auth/server";
import { OTP } from "$lib/models/OTPs";
import { Parsers } from "$lib/schema/parsers";
import type { Actions } from "@sveltejs/kit";
import { z } from "zod";

export const actions: Actions = {
    default: async ({ request, url }) => {
        const { email } = await Parsers.form(
            request,
            z.object({ email: z.string().email() })
        );

        const user = await getUserByEmail(email);

        // Don't reveal whether the email exists or not
        if (!user) return { ok: true };

        const { _id } = user;
        const otp = await OTP.getOrCreate({
            identifier: `_id:${_id.toString()}`,
            kind: "password-reset",
        });

        const href = `${url.origin}/reset-password?token=${otp.token}`;
        console.log(href);
        console.log("TODO: sendEmail");

        return { ok: true };
    },
};
