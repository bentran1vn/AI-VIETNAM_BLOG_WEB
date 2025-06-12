import { UserRole } from "./user";

export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  username: string;
  password: string;
}
