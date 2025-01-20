import { get_user } from "$lib/auth/server";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals }) => {
  await get_user(locals, { admin: true });
  return {};
}) satisfies PageServerLoad;
