export enum UserRoleEnum {
  "user",
  "admin",
}
export type UserRole = keyof typeof UserRoleEnum;

export const OrgRoleHierarchy = {
  "org:member": 0,
  "org:admin": 1,
  "org:owner": 2,
} as const;
export type OrgRole = keyof typeof OrgRoleHierarchy;

export type Role = UserRole | OrgRole;
