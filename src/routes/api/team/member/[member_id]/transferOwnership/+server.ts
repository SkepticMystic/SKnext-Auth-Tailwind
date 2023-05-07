import { auth, Users } from "$lib/auth/lucia";
import { getUser } from "$lib/auth/server";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const PUT: RequestHandler = async ({ locals, params }) => {
  const [user] = await Promise.all([
    getUser(locals),
  ]);

  if (user.role !== "owner") {
    throw error(
      403,
      "You cannot transfer ownership of a team if you are not the owner.",
    );
  }

  if (user.userId === params.member_id) {
    throw error(400, "You cannot transfer ownership to yourself.");
  }

  const member = await Users.findOne({
    _id: params.member_id,
    team_id: user.team_id,
  }).lean();
  if (!member) {
    throw error(404, "Member not found.");
  }

  // At this point, we know
  // - the user is the owner
  // - the user is not the member
  // - the member exists
  // - the member is in the same team as the user
  await Promise.all([
    auth.updateUserAttributes(user.userId, { role: "member" }),
    auth.updateUserAttributes(params.member_id, { role: "owner" }),
  ]);

  return json({ ok: true });
};
