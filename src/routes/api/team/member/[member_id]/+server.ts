import { getUser } from "$lib/auth/server";
import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { auth, Users } from "$lib/auth/lucia";
import { Teams } from "$lib/models/Teams";
import { RoleHierarchy } from "$lib/auth/roles";

export const DELETE: RequestHandler = async ({ locals, params }) => {
  const user = await getUser(locals);
  const { member_id } = params;

  if (user.userId === member_id) {
    throw error(400, "You cannot remove yourself from the team.");
  }

  const member = await Users.findOne({
    _id: member_id,
    team_id: user.team_id,
  }).lean();

  if (!member) {
    throw error(404, "Member not found.");
  }

  if (RoleHierarchy[user.role] < RoleHierarchy[member.role]) {
    throw error(403, "You cannot remove a member with a higher role than you.");
  }

  // At this point, we know that
  // - The user is not removing themselves
  // - The user is removing a member of their team
  // - The user is not removing a member with a higher role than them

  const newTeam = new Teams();
  await Promise.all([
    auth.updateUserAttributes(member_id, {
      team_id: newTeam._id,
      role: "owner",
    }),
    newTeam.save(),
  ]);

  return json({ ok: true });
};
