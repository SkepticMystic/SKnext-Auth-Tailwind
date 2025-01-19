import { Users } from "$lib/auth/lucia";
import { getUser } from "$lib/auth/server";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
  const [_admin, users] = await Promise.all([
    getUser(locals, { admin: true }),
    Users.find(
      {},
      { admin: 1, email: 1, emailVerified: 1, role: 1, team_id: 1 },
    ).lean(),
  ]);

  return { users };
}) satisfies PageServerLoad;
