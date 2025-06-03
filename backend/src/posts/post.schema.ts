import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';

@ObjectType()
@Schema()
export class Post extends Document {
  @Field()
  declare _id: string;

  @Field()
  @Prop({ required: true })
  title: string;

  @Field()
  @Prop({ required: true })
  content: string;

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
