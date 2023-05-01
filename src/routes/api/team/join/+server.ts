import { auth } from "$lib/auth/lucia";
import { OTP, type TeamInviteOTP } from "$lib/models/OTPs";
import { Parsers } from "$lib/schema/parsers";
import { error, redirect } from "@sveltejs/kit";
import { z } from "zod";
import type { RequestHandler } from "./$types";

const invalidTokenError = error(
  400,
  "Invalid token. Please request a new invite link.",
);

export const GET: RequestHandler = async ({ url, locals }) => {
  const { team_id, token } = Parsers.params(
    url,
    z.object({
      token: z.string().min(1),
      team_id: z.string().min(1),
    }),
  );

  if (team_id) {
    const { user } = await locals.auth.validateUser();
    // Check if they've already accepted this invite
    if (user?.team_id === team_id) {
      console.log("User already on this team");
      // They are already a member of this org
      throw redirect(302, "/");
    }
  }

  const checkToken = await OTP.validateToken<TeamInviteOTP>({
    token,
    kind: "team-invite",
  });
  if (!checkToken.ok) {
    console.log("validateToken failed", token);
    throw invalidTokenError;
  }
  const otp = checkToken.data;

  const checkUser = await OTP.getTokenUser(otp);
  if (!checkUser.ok) {
    if (checkUser.error.message === "user_not_found") {
      console.log("Valid token, no existing user");
      // Create a new user
      throw redirect(
        302,
        `/signup?email_hint=${
          encodeURIComponent(
            checkUser.error.id.value,
          )
        }&team_token=${encodeURIComponent(token)}`,
      );
    } else {
      console.log("getTokenUser failed", checkUser.error);
      await otp.deleteOne();
      throw invalidTokenError;
    }
  }

  // At this point, we know:
  // - The token is valid
  // - The user exists
  // - The user is not already a member of this team
  const { user } = checkUser.data;

  // TODO: Do something with their old team
  // - If they are the only member, delete it

  // Update their team
  await Promise.all([
    auth.updateUserAttributes(user.userId, {
      team_id: otp.data.team_id,
      role: otp.data.role,
      // If they are an existing user, but haven't verified their email, it is verified now
      emailVerified: true,
    }),
    otp.deleteOne(),
  ]);

  throw redirect(
    302,
    `/signin?email_hint=${encodeURIComponent(user.email)}&previous=team-invite`,
  );
};
