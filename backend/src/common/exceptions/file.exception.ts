import { HttpException, HttpStatus } from '@nestjs/common';

export class FileException extends HttpException {
  constructor(message: string) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message,
        error: 'File Error',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
