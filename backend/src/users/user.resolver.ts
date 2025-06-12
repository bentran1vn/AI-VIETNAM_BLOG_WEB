import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { User } from "./user.schema";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { LoginResponse } from "./dto/login-response.dto";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";
import { Roles } from "./decorators/roles.decorator";
import { UserRole } from "./user.schema";
import { RefreshTokenResponse } from "./dto/refresh-token-response.dto";
import { Response } from "express";
import { UnauthorizedException } from "@nestjs/common";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => LoginResponse)
  async login(
    @Args("username") username: string,
    @Args("password") password: string,
    @Context() context: { res: Response },
  ): Promise<LoginResponse> {
    const response = await this.userService.login(username, password);

    // Set HTTP-only cookies
    context.res.cookie("accessToken", response.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    context.res.cookie("refreshToken", response.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return response;
  }

  @Mutation(() => Boolean)
  logout(@Context() context: { res: Response }): boolean {
    // Clear the authentication cookies
    context.res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    context.res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return true;
  }

  @Mutation(() => RefreshTokenResponse)
  async refreshToken(
    @Context() context: { req: { cookies: { refreshToken: string } }; res: Response },
  ): Promise<RefreshTokenResponse> {
    const refreshToken = context.req.cookies.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException("No refresh token provided");
    }
    const response = await this.userService.refreshToken(refreshToken);

    // Set the new access token as a cookie
    context.res.cookie("accessToken", response.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return response;
  }

  @Query(() => [User])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  me(@Context() context: { req: { user: User } }): User {
    return context.req.user;
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createUser(@Args("createUserInput") createUserInput: CreateUserInput): Promise<User> {
    return this.userService.create(createUserInput);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Args("id") id: string,
    @Args("updateUserInput") updateUserInput: UpdateUserInput,
  ): Promise<User | null> {
    return this.userService.update(id, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async removeUser(@Args("id") id: string): Promise<User | null> {
    return this.userService.remove(id);
  }
}
