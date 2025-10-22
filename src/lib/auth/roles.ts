export enum Role {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  USER = "USER",
}

// Simple role hierarchy check
export function hasAccess(userRole: Role, required: Role[]): boolean {
  return required.includes(userRole);
}
