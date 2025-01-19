export const ROLES = ["member", "admin", "owner"] as const;
export type Role = (typeof ROLES)[number];
