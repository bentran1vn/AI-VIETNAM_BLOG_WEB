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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const files_service_1 = require("./files.service");
let FileMetadata = class FileMetadata {
    filename;
    size;
    lastModified;
    created;
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], FileMetadata.prototype, "filename", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], FileMetadata.prototype, "size", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], FileMetadata.prototype, "lastModified", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], FileMetadata.prototype, "created", void 0);
FileMetadata = __decorate([
    (0, graphql_1.ObjectType)()
], FileMetadata);
let FileNode = class FileNode {
    name;
    type;
    path;
    children;
};
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], FileNode.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], FileNode.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], FileNode.prototype, "path", void 0);
__decorate([
    (0, graphql_1.Field)(() => [FileNode], { nullable: true }),
    __metadata("design:type", Array)
], FileNode.prototype, "children", void 0);
FileNode = __decorate([
    (0, graphql_1.ObjectType)()
], FileNode);
let FilesResolver = class FilesResolver {
    filesService;
    constructor(filesService) {
        this.filesService = filesService;
    }
    async getDirectoryStructure() {
        return this.filesService.getDirectoryStructure();
    }
    async getFileContent(filePath) {
        const parts = filePath.split("/");
        const filename = parts.pop() || "";
        const module = parts.join("/");
        return this.filesService.getFileContent(module, filename);
    }
    async getFileMetadata(filePath) {
        const parts = filePath.split("/");
        const filename = parts.pop() || "";
        const module = parts.join("/");
        return this.filesService.getFileMetadata(module, filename);
    }
};
exports.FilesResolver = FilesResolver;
__decorate([
    (0, graphql_1.Query)(() => [FileNode]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FilesResolver.prototype, "getDirectoryStructure", null);
__decorate([
    (0, graphql_1.Query)(() => String),
    __param(0, (0, graphql_1.Args)("path")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FilesResolver.prototype, "getFileContent", null);
__decorate([
    (0, graphql_1.Query)(() => FileMetadata),
    __param(0, (0, graphql_1.Args)("path")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FilesResolver.prototype, "getFileMetadata", null);
exports.FilesResolver = FilesResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [files_service_1.FilesService])
], FilesResolver);
//# sourceMappingURL=files.resolver.js.map