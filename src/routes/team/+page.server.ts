import { Users } from "$lib/auth/lucia";
import { getUser } from "$lib/auth/server";
import { _idToString } from "$lib/utils";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
  const { team_id } = await getUser(locals);

  const members = await Users.find(
    { team_id },
    { email: 1, emailVerified: 1, role: 1 },
  ).lean();

  return {
    members: members.map(_idToString),
  };
}) satisfies PageServerLoad;
