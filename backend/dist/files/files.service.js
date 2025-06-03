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
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const file_exception_1 = require("../common/exceptions/file.exception");
const github_service_1 = require("./github.service");
const local_storage_service_1 = require("./local-storage.service");
let FilesService = class FilesService {
    configService;
    githubService;
    localStorageService;
    storage;
    constructor(configService, githubService, localStorageService) {
        this.configService = configService;
        this.githubService = githubService;
        this.localStorageService = localStorageService;
        this.storage =
            this.configService.get('NODE_ENV') === 'production'
                ? this.githubService
                : this.localStorageService;
    }
    async getDirectoryStructure(relativePath = '') {
        try {
            return await this.storage.getDirectoryStructure(relativePath);
        }
        catch (error) {
            const err = error;
            throw new file_exception_1.FileException(`Failed to read directory structure: ${err.message}`);
        }
    }
    async getFileContent(module, filename) {
        try {
            const path = `${module}/${filename}`;
            return await this.storage.getFileContent(path);
        }
        catch (error) {
            const err = error;
            throw new file_exception_1.FileException(`Failed to read file ${filename}: ${err.message}`);
        }
    }
    async getFileMetadata(module, filename) {
        try {
            const path = `${module}/${filename}`;
            return await this.storage.getFileMetadata(path);
        }
        catch (error) {
            const err = error;
            throw new file_exception_1.FileException(`Failed to get metadata for ${filename}: ${err.message}`);
        }
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        github_service_1.GitHubService,
        local_storage_service_1.LocalStorageService])
], FilesService);
//# sourceMappingURL=files.service.js.map