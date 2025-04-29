import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/domain/entity';

@Injectable()
export class GenerateJwtService {
  constructor() {}

  async generate(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    await Promise.resolve();
    return {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };
  }
}
