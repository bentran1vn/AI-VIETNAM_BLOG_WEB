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
exports.PostResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const post_service_1 = require("./post.service");
const post_schema_1 = require("./post.schema");
let PostResolver = class PostResolver {
    postService;
    constructor(postService) {
        this.postService = postService;
    }
    async posts() {
        return this.postService.findAll();
    }
    async post(id) {
        return this.postService.findOne(id);
    }
    async createPost(title, content) {
        return this.postService.create({ title, content });
    }
    async updatePost(id, title, content) {
        return this.postService.update(id, { title, content });
    }
    async deletePost(id) {
        return this.postService.delete(id);
    }
};
exports.PostResolver = PostResolver;
__decorate([
    (0, graphql_1.Query)(() => [post_schema_1.Post]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    (0, graphql_1.Query)(() => post_schema_1.Post),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "post", null);
__decorate([
    (0, graphql_1.Mutation)(() => post_schema_1.Post),
    __param(0, (0, graphql_1.Args)('title')),
    __param(1, (0, graphql_1.Args)('content')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    (0, graphql_1.Mutation)(() => post_schema_1.Post),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __param(1, (0, graphql_1.Args)('title', { nullable: true })),
    __param(2, (0, graphql_1.Args)('content', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    (0, graphql_1.Mutation)(() => post_schema_1.Post),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
exports.PostResolver = PostResolver = __decorate([
    (0, graphql_1.Resolver)(() => post_schema_1.Post),
    __metadata("design:paramtypes", [post_service_1.PostService])
], PostResolver);
//# sourceMappingURL=post.resolver.js.map