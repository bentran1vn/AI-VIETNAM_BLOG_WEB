import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Document } from "mongoose";

export enum UserRole {
  ADMIN = "ADMIN",
  STUDENT = "STUDENT",
}

registerEnumType(UserRole, {
  name: "UserRole",
  description: "The role of the user",
});

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  _id: string;
  createdAt: Date;
  toObject(): {
    username: string;
    email: string;
    password: string;
    role: UserRole;
    _id: string;
    createdAt: Date;
  };
}

@ObjectType()
@Schema()
export class User extends Document {
  @Field()
  declare _id: string;

  @Field()
  @Prop({ required: true, unique: true })
  username: string;

  @Field()
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Field(() => UserRole)
  @Prop({ required: true, type: String, enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
