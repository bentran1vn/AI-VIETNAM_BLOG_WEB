import { FileNode } from './types';

export interface FileStorage {
  getDirectoryStructure(path?: string): Promise<FileNode[]>;
  getFileContent(path: string): Promise<string>;
  getFileMetadata(path: string): Promise<{
    filename: string;
    size: number;
    lastModified: Date;
    created: Date;
  }>;
}
