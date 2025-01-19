import { getUser } from "$lib/auth/server";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
  await getUser(locals, { admin: true });
  return {};
}) satisfies PageServerLoad;
