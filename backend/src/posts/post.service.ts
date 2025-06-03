import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from './post.schema';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async findAll(): Promise<Post[]> {
    return this.postModel.find().exec();
  }

  async findOne(id: string): Promise<Post | null> {
    return this.postModel.findById(id).exec();
  }

  async create(createPostDto: {
    title: string;
    content: string;
  }): Promise<Post> {
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }

  async update(
    id: string,
    updatePostDto: { title?: string; content?: string },
  ): Promise<Post | null> {
    return this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Post | null> {
    return this.postModel.findByIdAndDelete(id).exec();
  }
}
