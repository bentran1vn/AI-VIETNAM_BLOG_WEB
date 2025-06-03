import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileException } from '../common/exceptions/file.exception';
import { FileNode } from './types';
import { GitHubService } from './github.service';
import { LocalStorageService } from './local-storage.service';
import { FileStorage } from './file-storage.interface';

@Injectable()
export class FilesService {
  private storage: FileStorage;

  constructor(
    private configService: ConfigService,
    private githubService: GitHubService,
    private localStorageService: LocalStorageService,
  ) {
    // Use GitHub in production, local storage in development
    this.storage =
      this.configService.get<string>('NODE_ENV') === 'production'
        ? this.githubService
        : this.localStorageService;
  }

  async getDirectoryStructure(relativePath: string = ''): Promise<FileNode[]> {
    try {
      return await this.storage.getDirectoryStructure(relativePath);
    } catch (error) {
      const err = error as Error;
      throw new FileException(
        `Failed to read directory structure: ${err.message}`,
      );
    }
  }

  async getFileContent(module: string, filename: string): Promise<string> {
    try {
      const path = `${module}/${filename}`;
      return await this.storage.getFileContent(path);
    } catch (error) {
      const err = error as Error;
      throw new FileException(
        `Failed to read file ${filename}: ${err.message}`,
      );
    }
  }

  async getFileMetadata(module: string, filename: string) {
    try {
      const path = `${module}/${filename}`;
      return await this.storage.getFileMetadata(path);
    } catch (error) {
      const err = error as Error;
      throw new FileException(
        `Failed to get metadata for ${filename}: ${err.message}`,
      );
    }
  }
}
