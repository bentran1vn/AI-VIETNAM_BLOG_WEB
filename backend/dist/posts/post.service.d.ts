import { Model } from "mongoose";
import { Post } from "./post.schema";
export declare class PostService {
    private postModel;
    constructor(postModel: Model<Post>);
    findAll(): Promise<Post[]>;
    findOne(id: string): Promise<Post | null>;
    create(createPostDto: {
        title: string;
        content: string;
    }): Promise<Post>;
    update(id: string, updatePostDto: {
        title?: string;
        content?: string;
    }): Promise<Post | null>;
    delete(id: string): Promise<Post | null>;
}
