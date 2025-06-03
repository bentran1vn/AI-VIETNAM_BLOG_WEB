import { PostService } from './post.service';
import { Post } from './post.schema';
export declare class PostResolver {
    private readonly postService;
    constructor(postService: PostService);
    posts(): Promise<Post[]>;
    post(id: string): Promise<Post | null>;
    createPost(title: string, content: string): Promise<Post | null>;
    updatePost(id: string, title?: string, content?: string): Promise<Post | null>;
    deletePost(id: string): Promise<Post | null>;
}
