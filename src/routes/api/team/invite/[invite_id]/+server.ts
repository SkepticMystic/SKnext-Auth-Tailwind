import { getUser } from "$lib/auth/server";
import { OTPs, type TeamInviteOTP } from "$lib/models/OTPs";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { RoleHierarchy } from "$lib/auth/roles";

export const DELETE: RequestHandler = async ({ locals, params }) => {
  const user = await getUser(locals);

  const { invite_id } = params;

  const invite = await OTPs.findOne({
    _id: invite_id,
    kind: "team-invite",
    "data.team_id": user.team_id,
  }).lean() as TeamInviteOTP | null;

  if (!invite) {
    throw error(404, "Invite not found");
  }

  if (RoleHierarchy[user.role] < RoleHierarchy[invite.data.role]) {
    throw error(
      403,
      "You cannot delete invites for roles higher than your own",
    );
  }

  const { acknowledged } = await OTPs.deleteOne({
    _id: invite_id,
    kind: "team-invite",
    "data.team_id": user.team_id,
  });

  return json({ ok: acknowledged });
};
