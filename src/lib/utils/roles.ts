import { ROLES, type Role } from "$lib/auth/roles";

const has_atleast = (user: Lucia.DatabaseUserAttributes, role: Role) => {
  const needs_i = ROLES.indexOf(role);
  const has_i = ROLES.indexOf(user.role);

  if (has_i === -1 || needs_i === -1) {
    throw new Error(`Role ${role} not found in ROLES`);
  }

  return has_i >= needs_i;
};

export const Roles = {
  has_atleast,
};
