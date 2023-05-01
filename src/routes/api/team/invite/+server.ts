import { getUser } from "$lib/auth/server";
import { Parsers } from "$lib/schema/parsers";
import { z } from "zod";
import type { RequestHandler } from "./$types";
import { RoleHierarchy, ROLES } from "$lib/auth/roles";
import { error, json } from "@sveltejs/kit";
import { OTP, type TeamInviteOTP } from "$lib/models/OTPs";
import { Users } from "$lib/auth/lucia";

export const POST: RequestHandler = async ({ locals, request, url }) => {
  const [user, invite] = await Promise.all([
    getUser(locals),
    Parsers.request(
      request,
      z.object({
        email: z.string().email(),
        role: z.enum(ROLES),
      }),
    ),
  ]);

  const members = await Users.find({ team_id: user.team_id }).lean();
  if (members.some((m) => m.email === invite.email)) {
    throw error(400, invite.email + " is already a member of this team");
  }

  if (RoleHierarchy[user.role] < RoleHierarchy[invite.role]) {
    throw error(403, "You cannot invite someone with a higher role than you");
  }

  const otp = await OTP.create<TeamInviteOTP>({
    identifier: `email:${invite.email}`,
    kind: "team-invite",
    data: {
      createdBy: user.userId,
      role: invite.role,
      team_id: user.team_id,
    },
  });

  const href =
    `${url.origin}/api/team/join?token=${otp.token}&team_id=${user.team_id}`;
  console.log(href);
  console.log("TODO: sendEmail");

  return json({ ok: true });
};
