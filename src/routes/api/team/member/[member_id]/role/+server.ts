import { auth, Users } from "$lib/auth/lucia";
import { ROLES } from "$lib/auth/roles";
import { get_user } from "$lib/auth/server";
import { Parsers } from "$lib/schema/parsers";
import { Roles } from "$lib/utils/roles";
import { error, json } from "@sveltejs/kit";
import { z } from "zod";
import type { RequestHandler } from "./$types";

export const PUT: RequestHandler = async ({ locals, request, params }) => {
  const [user, { newRole }] = await Promise.all([
    get_user(locals),
    Parsers.request(request, z.object({ newRole: z.enum(ROLES) })),
  ]);

  if (newRole === "owner") {
    error(
      400,
      "You cannot change a member's role to owner. Use the transfer ownership button instead.",
    );
  }

  const { member_id } = params;

  if (user.userId === member_id) {
    error(400, "You cannot change your own role.");
  } else if (!Roles.has_atleast(user, newRole)) {
    error(
      403,
      "You cannot change a member's role to a higher role than your own.",
    );
  }

  const member = await Users.findOne({
    _id: member_id,
    team_id: user.team_id,
  }).lean();
  if (!member) {
    error(404, "Member not found.");
  } else if (!Roles.has_atleast(user, member.role)) {
    error(
      403,
      "You cannot change the role of a member with a higher role than your own.",
    );
  }

  await auth.updateUserAttributes(member_id, {
    role: newRole,
  });

  return json({ ok: true });
};
