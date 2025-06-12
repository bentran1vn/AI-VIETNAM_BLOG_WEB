export enum UserRole {
  ADMIN = "ADMIN",
  STUDENT = "STUDENT",
}

export interface User {
  _id: string;
  email: string;
  username: string;
  role: UserRole;
  createdAt: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  username: string;
  role: UserRole;
}

export interface CreateUserResponse {
  createUser: User;
}

export interface GetUsersResponse {
  users: User[];
}
