export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export enum UserRole {
  ADMIN = "admin",
  OPERATOR = "operator",
}
