import { ConfigService } from "@nestjs/config";
import { FileNode } from "./types";
import { FileStorage } from "./file-storage.interface";
export declare class GitHubService implements FileStorage {
    private configService;
    private octokit;
    private owner;
    private repo;
    private branch;
    private basePath;
    constructor(configService: ConfigService);
    private getContent;
    getDirectoryStructure(path?: string): Promise<FileNode[]>;
    getFileContent(path: string): Promise<string>;
    getFileMetadata(path: string): Promise<{
        filename: string;
        size: number;
        lastModified: Date;
        created: Date;
    }>;
}
