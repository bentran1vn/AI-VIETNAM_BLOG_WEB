import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class FileMetadata {
  @Field()
  filename: string;

  @Field()
  size: number;

  @Field()
  lastModified: Date;

  @Field()
  created: Date;
}
