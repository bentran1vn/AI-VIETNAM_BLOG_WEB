import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "../types/jwt-payload.type";
import { Request } from "express";

const getAccessTokenFromCookies = (req: Request): string | null => {
  if (req && typeof req === "object" && "cookies" in req) {
    const cookies = (req as { cookies?: { accessToken?: string } }).cookies;
    if (cookies && typeof cookies.accessToken === "string") {
      return cookies.accessToken;
    }
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([getAccessTokenFromCookies]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET") ?? "fallback-secret",
    });
  }

  validate(payload: JwtPayload) {
    return {
      _id: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
