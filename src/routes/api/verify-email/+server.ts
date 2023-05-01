import { auth, Users } from "$lib/auth/lucia";
import { OTP } from "$lib/models/OTPs";
import { Parsers } from "$lib/schema/parsers";
import { error, redirect, type RequestHandler } from "@sveltejs/kit";
import { z } from "zod";

export const GET: RequestHandler = async ({ url }) => {
  const { _id, token } = Parsers.params(
    url,
    z.object({
      _id: z.string(),
      token: z.string(),
    }),
  );

  const verifiedUser = await Users.findOne({
    _id,
    emailVerified: true,
  }).lean();
  if (verifiedUser) {
    console.log("User already verified");
    throw redirect(302, "/");
  }

  const check = await OTP.validateUserToken({
    token,
    kind: "email-verification",
  });
  if (!check.ok) throw error(400, "Invalid token");

  const { user, otp } = check.data;

  await Promise.all([
    auth.updateUserAttributes(user.userId, { emailVerified: true }),
    otp.deleteOne(),
  ]);

  throw redirect(302, "/");
};
