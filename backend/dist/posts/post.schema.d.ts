import { Document } from "mongoose";
export declare class Post extends Document {
    _id: string;
    title: string;
    content: string;
    createdAt: Date;
}
export declare const PostSchema: import("mongoose").Schema<Post, import("mongoose").Model<Post, any, any, any, Document<unknown, any, Post, any> & Post & Required<{
    _id: string;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Post, Document<unknown, {}, import("mongoose").FlatRecord<Post>, {}> & import("mongoose").FlatRecord<Post> & Required<{
    _id: string;
}> & {
    __v: number;
}>;
