import { ConfigService } from "@nestjs/config";
import { FileStorage } from "./file-storage.interface";
import { FileNode } from "./types";
export declare class LocalStorageService implements FileStorage {
    private configService;
    private storagePath;
    constructor(configService: ConfigService);
    getDirectoryStructure(relativePath?: string): Promise<FileNode[]>;
    getFileContent(filePath: string): Promise<string>;
    getFileMetadata(filePath: string): Promise<{
        filename: string;
        size: number;
        lastModified: Date;
        created: Date;
    }>;
}
