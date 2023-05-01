import { auth } from "$lib/auth/lucia";
import { OTP } from "$lib/models/OTPs";
import { passwordSchema } from "$lib/schema/index";
import { Parsers } from "$lib/schema/parsers";
import { INTERNAL_SERVER_ERROR } from "$lib/utils/errors";
import { type Actions, error, redirect } from "@sveltejs/kit";
import { z } from "zod";

export const actions: Actions = {
  default: async ({ request, locals, url }) => {
    const { email, password } = await Parsers.form(
      request,
      z.object({
        email: z.string().email(),
        password: passwordSchema,
      }),
    );

    try {
      const { userId } = await auth.createUser({
        attributes: {
          email,
          emailVerified: false,
          role: "member",
        },
        primaryKey: {
          password,
          providerId: "email",
          providerUserId: email,
        },
      });

      // If successful, we know there were no existing email-verification OTPs,
      //   since we just created the user
      //   so we can create a new one without checking for existing
      const otp = await OTP.create({
        identifier: `_id:${userId}`,
        kind: "email-verification",
      });
      const href =
        `${url.origin}/api/verify-email?token=${otp.token}&_id=${userId}`;
      console.log(href);
      console.log("TODO: sendEmail");

      const session = await auth.createSession(userId);
      locals.setSession(session);
    } catch (e) {
      const { message } = e as Error;
      if (
        message === "AUTH_DUPLICATE_KEY_ID" ||
        message === "AUTH_DUPLICATE_USER_DATA"
      ) {
        throw error(400, "Email already in use");
      }

      throw INTERNAL_SERVER_ERROR(e);
    }

    throw redirect(302, "/");
  },
};
