import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "../user.schema";

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user: User;
}
