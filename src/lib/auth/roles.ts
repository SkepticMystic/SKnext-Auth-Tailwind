export const RoleHierarchy = {
  "member": 0,
  "admin": 1,
  "owner": 2,
} as const;
export type Role = keyof typeof RoleHierarchy;
