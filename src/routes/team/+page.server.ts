import { Users } from "$lib/auth/lucia";
import { get_user } from "$lib/auth/server";
import type { SID } from "$lib/interfaces";
import { OTPs, type TeamInviteOTP } from "$lib/models/OTPs";
import { _id_to_string } from "$lib/utils";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
  const { team_id } = await get_user(locals);

  const [members, pendingInvites] = await Promise.all([
    Users.find({ team_id }, { email: 1, email_verified: 1, role: 1 }).lean(),
    OTPs.find(
      { kind: "team-invite", "data.team_id": team_id },
      { token: 0 },
    ).lean(),
  ]);

  return {
    members: members.map(_id_to_string),
    pendingInvites: pendingInvites.map(_id_to_string) as SID<TeamInviteOTP>[],
  };
}) satisfies PageServerLoad;
