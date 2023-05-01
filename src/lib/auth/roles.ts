export const ROLES = ["member", "admin", "owner"] as const;
export type Role = typeof ROLES[number];

export const RoleHierarchy: Record<Role, number> = {
  "member": 0,
  "admin": 1,
  "owner": 2,
} as const;
