import { Users } from "$lib/auth/lucia";
import { getUser } from "$lib/auth/server";
import type { SID } from "$lib/interfaces";
import { OTPs, type TeamInviteOTP } from "$lib/models/OTPs";
import { _idToString } from "$lib/utils";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
  const { team_id } = await getUser(locals);

  const [members, pendingInvites] = await Promise.all([
    Users.find({ team_id }, { email: 1, emailVerified: 1, role: 1 }).lean(),
    OTPs.find(
      { kind: "team-invite", "data.team_id": team_id },
      { token: 0 },
    ).lean(),
  ]);

  return {
    members: members.map(_idToString),
    pendingInvites: pendingInvites.map(_idToString) as SID<TeamInviteOTP>[],
  };
}) satisfies PageServerLoad;
