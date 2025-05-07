import { UnauthorizedException } from '@nestjs/common';

export class UnauthorizedAccessException extends UnauthorizedException {
  constructor(message: string = 'Unauthorized access') {
    super(message);
  }
}