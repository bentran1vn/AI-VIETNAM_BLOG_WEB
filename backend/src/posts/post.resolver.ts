import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { PostService } from "./post.service";
import { Post } from "./post.schema";

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return this.postService.findAll();
  }

  @Query(() => Post)
  async post(@Args("id", { type: () => ID }) id: string): Promise<Post | null> {
    return this.postService.findOne(id);
  }

  @Mutation(() => Post)
  async createPost(
    @Args("title") title: string,
    @Args("content") content: string,
  ): Promise<Post | null> {
    return this.postService.create({ title, content });
  }

  @Mutation(() => Post)
  async updatePost(
    @Args("id", { type: () => ID }) id: string,
    @Args("title", { nullable: true }) title?: string,
    @Args("content", { nullable: true }) content?: string,
  ): Promise<Post | null> {
    return this.postService.update(id, { title, content });
  }

  @Mutation(() => Post)
  async deletePost(@Args("id", { type: () => ID }) id: string): Promise<Post | null> {
    return this.postService.delete(id);
  }
}
