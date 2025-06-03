import { Resolver, Query, Args, ObjectType, Field } from '@nestjs/graphql';
import { FilesService } from './files.service';
import { FileNode as FileNodeType } from './types';

@ObjectType()
class FileMetadata {
  @Field()
  filename: string;

  @Field()
  size: number;

  @Field()
  lastModified: Date;

  @Field()
  created: Date;
}

@ObjectType()
class FileNode {
  @Field()
  name: string;

  @Field()
  type: string;

  @Field()
  path: string;

  @Field(() => [FileNode], { nullable: true })
  children?: FileNode[];
}

@Resolver()
export class FilesResolver {
  constructor(private readonly filesService: FilesService) {}

  @Query(() => [FileNode])
  async getDirectoryStructure(): Promise<FileNodeType[]> {
    return this.filesService.getDirectoryStructure();
  }

  @Query(() => String)
  async getFileContent(@Args('path') filePath: string) {
    const parts = filePath.split('/');
    const filename = parts.pop() || '';
    const module = parts.join('/');
    return this.filesService.getFileContent(module, filename);
  }

  @Query(() => FileMetadata)
  async getFileMetadata(@Args('path') filePath: string) {
    const parts = filePath.split('/');
    const filename = parts.pop() || '';
    const module = parts.join('/');
    return this.filesService.getFileMetadata(module, filename);
  }
}
