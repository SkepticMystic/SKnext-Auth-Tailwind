import { auth } from "$lib/auth/lucia";
import { OTP } from "$lib/models/OTPs";
import { password_schema } from "$lib/schema";
import { Parsers } from "$lib/schema/parsers";
import { INTERNAL_SERVER_ERROR } from "$lib/utils/errors";
import { type Actions, error } from "@sveltejs/kit";
import { z } from "zod";

export const actions: Actions = {
  default: async ({ request, url }) => {
    const { token } = Parsers.url(url, z.object({ token: z.string() }));

    const input = await Parsers.form(
      request,
      z
        .object({ new: password_schema, confirm: password_schema })
        .refine(
          (input) => input.new === input.confirm,
          "Passwords do not match",
        ),
    );

    const check = await OTP.validateUserToken({
      token,
      kind: "password-reset",
    });
    if (!check.ok) error(400, "Invalid token");

    const { user, otp } = check.data;
    try {
      await Promise.all([
        auth.updateKeyPassword("email", user.email, input.new),
        otp.deleteOne(),
      ]);

      return { ok: true };
    } catch (err) {
      console.log(err);
      throw INTERNAL_SERVER_ERROR(err);
    }
  },
};
