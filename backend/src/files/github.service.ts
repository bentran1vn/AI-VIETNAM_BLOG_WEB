import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from 'octokit';
import { FileNode } from './types';
import { FileStorage } from './file-storage.interface';

interface GitHubContent {
  type: string;
  name: string;
  path: string;
  content?: string;
  size?: number;
  sha?: string;
  updated_at?: string;
  created_at?: string;
}

interface GitHubResponse {
  data: GitHubContent | GitHubContent[];
}

type TypedOctokit = {
  rest: {
    repos: {
      getContent: (params: {
        owner: string;
        repo: string;
        path: string;
        ref: string;
      }) => Promise<GitHubResponse>;
    };
  };
};

type OctokitConstructor = {
  new (options: { auth: string }): TypedOctokit;
};

function createOctokit(token: string | undefined): TypedOctokit {
  if (!token) {
    throw new Error('GitHub token is required');
  }
  const OctokitConstructor = Octokit as unknown as OctokitConstructor;
  return new OctokitConstructor({ auth: token });
}

@Injectable()
export class GitHubService implements FileStorage {
  private octokit: TypedOctokit;
  private owner: string;
  private repo: string;
  private branch: string;

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('GITHUB_TOKEN');
    this.octokit = createOctokit(token);
    this.owner = this.configService.get<string>('GITHUB_OWNER') as string;
    this.repo = this.configService.get<string>('GITHUB_REPO') as string;
    this.branch = this.configService.get<string>('GITHUB_BRANCH') as string;
  }

  async getDirectoryStructure(path: string = ''): Promise<FileNode[]> {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });

      if (Array.isArray(response.data)) {
        const structure: FileNode[] = [];
        for (const item of response.data) {
          if (item.type === 'dir') {
            const children = await this.getDirectoryStructure(item.path);
            structure.push({
              name: item.name,
              type: 'directory',
              path: item.path,
              children,
            });
          } else if (
            item.type === 'file' &&
            (item.name.endsWith('.md') || item.name.endsWith('.tex'))
          ) {
            structure.push({
              name: item.name,
              type: 'file',
              path: item.path,
            });
          }
        }
        return structure;
      }
      return [];
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch directory structure: ${errorMessage}`);
    }
  }

  async getFileContent(path: string): Promise<string> {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });

      if ('content' in response.data) {
        return Buffer.from(response.data.content || '', 'base64').toString(
          'utf-8',
        );
      }
      throw new Error('File content not found');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch file content: ${errorMessage}`);
    }
  }

  async getFileMetadata(path: string) {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });

      if ('sha' in response.data) {
        return {
          filename: response.data.name,
          size: response.data.size || 0,
          lastModified: new Date(response.data.updated_at || ''),
          created: new Date(response.data.created_at || ''),
        };
      }
      throw new Error('File metadata not found');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to fetch file metadata: ${errorMessage}`);
    }
  }
}
