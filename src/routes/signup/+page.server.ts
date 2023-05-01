import { auth } from "$lib/auth/lucia";
import { OTP, OTPs, type TeamInviteOTP } from "$lib/models/OTPs";
import { Teams } from "$lib/models/Teams";
import { passwordSchema } from "$lib/schema/index";
import { Parsers } from "$lib/schema/parsers";
import { INTERNAL_SERVER_ERROR } from "$lib/utils/errors";
import { type Actions, error, redirect } from "@sveltejs/kit";
import type { User } from "lucia-auth";
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

    const { team_token } = Parsers.params(
      url,
      z.object({
        team_token: z.string().optional(),
      }),
    );

    // SECTION: Team

    let attributes: Pick<User, "emailVerified" | "role" | "team_id">;

    if (team_token) {
      // Find and delete the OTP
      const otp = await OTPs.findOneAndDelete({
        token: team_token,
        kind: "team-invite",
        identifier: `email:${email}`,
      }).lean() as TeamInviteOTP | null;
      if (!otp) throw error(400, "Invalid team token");

      attributes = {
        emailVerified: true,
        role: otp.data.role,
        team_id: otp.data.team_id,
      };
    } else {
      const team = await Teams.create({});
      attributes = {
        emailVerified: false,
        role: "owner",
        team_id: team._id,
      };
    }
    console.log({ email, password, attributes });
    // !SECTION

    try {
      const { userId } = await auth.createUser({
        attributes: {
          email,
          ...attributes,
        },
        primaryKey: {
          password,
          providerId: "email",
          providerUserId: email,
        },
      });

      if (!attributes.emailVerified) {
        await OTP.handleLinks["email-verification"]({
          url,
          idValue: userId,
        });
      }

      const session = await auth.createSession(userId);
      locals.auth.setSession(session);
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
