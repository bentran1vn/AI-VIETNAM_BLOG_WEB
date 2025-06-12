import { UserRole } from "../user.schema";

export interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
}
