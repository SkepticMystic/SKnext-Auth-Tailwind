import { Users } from "$lib/auth/lucia";
import { ROLES } from "$lib/auth/roles";
import { getUser, hasAtleastRole } from "$lib/auth/server";
import { OTP } from "$lib/models/OTPs";
import { Parsers } from "$lib/schema/parsers";
import { error, json } from "@sveltejs/kit";
import { z } from "zod";
import type { RequestHandler } from "./$types";

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

  if (!hasAtleastRole(user, invite.role)) {
    throw error(403, "You cannot invite someone with a higher role than you");
  }

  await OTP.handleLinks["team-invite"]({
    url,
    idValue: invite.email,
    data: {
      role: invite.role,
      team_id: user.team_id,
      createdBy: user.userId,
    },
  });

  return json({ ok: true });
};
