import { Users } from "$lib/auth/lucia";
import { getUser } from "$lib/auth/server";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
  await getUser(locals, { admin: true });

  const users = await Users.find(
    {},
    { admin: 1, email: 1, emailVerified: 1, role: 1, team_id: 1 },
  ).lean();

  return { users };
}) satisfies PageServerLoad;
