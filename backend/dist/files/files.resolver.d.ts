import { FilesService } from './files.service';
import { FileNode as FileNodeType } from './types';
export declare class FilesResolver {
    private readonly filesService;
    constructor(filesService: FilesService);
    getDirectoryStructure(): Promise<FileNodeType[]>;
    getFileContent(filePath: string): Promise<string>;
    getFileMetadata(filePath: string): Promise<{
        filename: string;
        size: number;
        lastModified: Date;
        created: Date;
    }>;
}
