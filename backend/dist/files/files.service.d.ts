import { ConfigService } from "@nestjs/config";
import { FileNode } from "./types";
import { GitHubService } from "./github.service";
import { LocalStorageService } from "./local-storage.service";
export declare class FilesService {
    private configService;
    private githubService;
    private localStorageService;
    private storage;
    constructor(configService: ConfigService, githubService: GitHubService, localStorageService: LocalStorageService);
    getDirectoryStructure(relativePath?: string): Promise<FileNode[]>;
    getFileContent(module: string, filename: string): Promise<string>;
    getFileMetadata(module: string, filename: string): Promise<{
        filename: string;
        size: number;
        lastModified: Date;
        created: Date;
    }>;
}
