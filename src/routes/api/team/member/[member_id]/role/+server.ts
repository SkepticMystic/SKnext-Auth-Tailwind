import { auth, Users } from "$lib/auth/lucia";
import { ROLES } from "$lib/auth/roles";
import { getUser, hasAtleastRole } from "$lib/auth/server";
import { Parsers } from "$lib/schema/parsers";
import { error, json } from "@sveltejs/kit";
import { z } from "zod";
import type { RequestHandler } from "./$types";

export const PUT: RequestHandler = async ({ locals, request, params }) => {
  const [user, { newRole }] = await Promise.all([
    getUser(locals),
    Parsers.request(
      request,
      z.object({ newRole: z.enum(ROLES) }),
    ),
  ]);

  if (newRole === "owner") {
    throw error(
      400,
      "You cannot change a member's role to owner. Use the transfer ownership button instead.",
    );
  }

  const { member_id } = params;

  if (user.userId === member_id) {
    throw error(400, "You cannot change your own role.");
  }

  if (!hasAtleastRole(user, newRole)) {
    throw error(
      403,
      "You cannot change a member's role to a higher role than your own.",
    );
  }

  const member = await Users.findOne({
    _id: member_id,
    team_id: user.team_id,
  }).lean();
  if (!member) {
    throw error(404, "Member not found.");
  }

  if (!hasAtleastRole(user, member.role)) {
    throw error(
      403,
      "You cannot change the role of a member with a higher role than your own.",
    );
  }

  await auth.updateUserAttributes(member_id, {
    role: newRole,
  });

  return json({ ok: true });
};
