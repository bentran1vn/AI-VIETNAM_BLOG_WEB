import { Injectable, ExecutionContext, CanActivate } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";

interface GqlContext {
  req: Request;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") implements CanActivate {
  getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext<GqlContext>();
    return req;
  }
}
