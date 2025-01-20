import { get_user } from "$lib/auth/server";
import { OTPs, type TeamInviteOTP } from "$lib/models/OTPs";
import { Roles } from "$lib/utils/roles";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const DELETE: RequestHandler = async ({ locals, params }) => {
  // TODO: Promise.all
  const user = await get_user(locals);

  const { invite_id } = params;

  const invite = (await OTPs.findOne({
    _id: invite_id,
    kind: "team-invite",
    "data.team_id": user.team_id,
  }).lean()) as TeamInviteOTP | null;

  if (!invite) {
    error(404, "Invite not found");
  } else if (!Roles.has_atleast(user, invite.data.role)) {
    error(403, "You cannot delete invites for roles higher than your own");
  }

  const { acknowledged } = await OTPs.deleteOne({
    _id: invite_id,
    kind: "team-invite",
    "data.team_id": user.team_id,
  });

  return json({ ok: acknowledged });
};
