import { auth } from "$lib/auth/lucia";
import { get_user } from "$lib/auth/server";
import { INTERNAL_SERVER_ERROR } from "$lib/utils/errors";
import { json, type RequestHandler } from "@sveltejs/kit";

export const DELETE: RequestHandler = async ({ locals }) => {
  const { userId } = await get_user(locals);

  try {
    await auth.deleteUser(userId);

    return json({ ok: true });
  } catch (err) {
    console.log(err);
    throw INTERNAL_SERVER_ERROR(err);
  }
};
