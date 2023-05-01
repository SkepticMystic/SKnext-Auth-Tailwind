import { auth } from "$lib/auth/lucia";
import { OTP } from "$lib/models/OTPs";
import { Parsers } from "$lib/schema/parsers";
import { error, redirect, type RequestHandler } from "@sveltejs/kit";
import { z } from "zod";

export const GET: RequestHandler = async ({ url }) => {
  const { token } = Parsers.params(url, z.object({ token: z.string() }));

  const check = await OTP.validateUserToken({
    token,
    kind: "email-verification",
  });
  if (!check.ok) throw error(400, "Invalid token");

  const { user, otp } = check;

  await auth.updateUserAttributes(user.userId, {
    emailVerified: true,
  });

  await otp.remove();

  throw redirect(302, "/");
};
