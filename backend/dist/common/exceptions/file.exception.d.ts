import { HttpException } from "@nestjs/common";
export declare class FileException extends HttpException {
    constructor(message: string);
}
