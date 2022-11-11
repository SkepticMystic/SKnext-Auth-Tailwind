export enum UserRoleEnum {
    'user',
    'admin'
}
export type UserRole = keyof typeof UserRoleEnum

export enum OrgRoleEnum {
    'org:member',
    'org:admin',
    'org:owner',
}
export type OrgRole = keyof typeof OrgRoleEnum

export type Role = UserRole | OrgRole;