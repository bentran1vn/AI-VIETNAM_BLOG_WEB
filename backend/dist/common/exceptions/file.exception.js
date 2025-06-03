"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileException = void 0;
const common_1 = require("@nestjs/common");
class FileException extends common_1.HttpException {
    constructor(message) {
        super({
            statusCode: common_1.HttpStatus.BAD_REQUEST,
            message,
            error: 'File Error',
        }, common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.FileException = FileException;
//# sourceMappingURL=file.exception.js.map