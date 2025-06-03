"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const octokit_1 = require("octokit");
function createOctokit(token) {
    if (!token) {
        throw new Error('GitHub token is required');
    }
    const OctokitConstructor = octokit_1.Octokit;
    return new OctokitConstructor({ auth: token });
}
let GitHubService = class GitHubService {
    configService;
    octokit;
    owner;
    repo;
    branch;
    constructor(configService) {
        this.configService = configService;
        const token = this.configService.get('GITHUB_TOKEN');
        this.octokit = createOctokit(token);
        this.owner = this.configService.get('GITHUB_OWNER');
        this.repo = this.configService.get('GITHUB_REPO');
        this.branch = this.configService.get('GITHUB_BRANCH');
    }
    async getDirectoryStructure(path = '') {
        try {
            const response = await this.octokit.rest.repos.getContent({
                owner: this.owner,
                repo: this.repo,
                path,
                ref: this.branch,
            });
            if (Array.isArray(response.data)) {
                const structure = [];
                for (const item of response.data) {
                    if (item.type === 'dir') {
                        const children = await this.getDirectoryStructure(item.path);
                        structure.push({
                            name: item.name,
                            type: 'directory',
                            path: item.path,
                            children,
                        });
                    }
                    else if (item.type === 'file' &&
                        (item.name.endsWith('.md') || item.name.endsWith('.tex'))) {
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
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to fetch directory structure: ${errorMessage}`);
        }
    }
    async getFileContent(path) {
        try {
            const response = await this.octokit.rest.repos.getContent({
                owner: this.owner,
                repo: this.repo,
                path,
                ref: this.branch,
            });
            if ('content' in response.data) {
                return Buffer.from(response.data.content || '', 'base64').toString('utf-8');
            }
            throw new Error('File content not found');
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to fetch file content: ${errorMessage}`);
        }
    }
    async getFileMetadata(path) {
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
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            throw new Error(`Failed to fetch file metadata: ${errorMessage}`);
        }
    }
};
exports.GitHubService = GitHubService;
exports.GitHubService = GitHubService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GitHubService);
//# sourceMappingURL=github.service.js.map