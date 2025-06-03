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
exports.LocalStorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs = require("fs/promises");
const path = require("path");
let LocalStorageService = class LocalStorageService {
    configService;
    storagePath;
    constructor(configService) {
        this.configService = configService;
        this.storagePath = this.configService.get("STORAGE_PATH");
    }
    async getDirectoryStructure(relativePath = "") {
        try {
            const fullPath = path.join(this.storagePath, relativePath);
            const entries = await fs.readdir(fullPath, { withFileTypes: true });
            const structure = [];
            for (const entry of entries) {
                const entryPath = path.join(relativePath, entry.name);
                if (entry.isDirectory()) {
                    const children = await this.getDirectoryStructure(entryPath);
                    structure.push({
                        name: entry.name,
                        type: "directory",
                        path: entryPath,
                        children,
                    });
                }
                else if (entry.isFile() && (entry.name.endsWith(".md") || entry.name.endsWith(".tex"))) {
                    structure.push({
                        name: entry.name,
                        type: "file",
                        path: entryPath,
                    });
                }
            }
            return structure;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            throw new Error(`Failed to read directory structure: ${errorMessage}`);
        }
    }
    async getFileContent(filePath) {
        try {
            if (!filePath.includes("/")) {
                throw new Error("File path must include a module directory");
            }
            const fullPath = path.join(this.storagePath, filePath);
            return await fs.readFile(fullPath, "utf-8");
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            throw new Error(`Failed to read file content: ${errorMessage}`);
        }
    }
    async getFileMetadata(filePath) {
        try {
            if (!filePath.includes("/")) {
                throw new Error("File path must include a module directory");
            }
            const fullPath = path.join(this.storagePath, filePath);
            const stats = await fs.stat(fullPath);
            return {
                filename: path.basename(filePath),
                size: stats.size,
                lastModified: stats.mtime,
                created: stats.birthtime,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            throw new Error(`Failed to get file metadata: ${errorMessage}`);
        }
    }
};
exports.LocalStorageService = LocalStorageService;
exports.LocalStorageService = LocalStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LocalStorageService);
//# sourceMappingURL=local-storage.service.js.map