import { Injectable } from '@nestjs/common';
import { EmailVerificationStoreOutPort } from 'src/auth/application/port/out';
import { UserEmail, EmailVerifyCode } from 'src/auth/domain/entity';
import { CacheService } from 'src/common/cache/cache.service';

@Injectable()
export class AuthRepository implements EmailVerificationStoreOutPort {
  constructor(private readonly cacheService: CacheService) {}

  private readonly EMAIL_VERIFY_CODE_EXPIRE_TIME = 60 * 5;
  private readonly EMAIL_VERIFY_CODE_KEY_NAME = `verify_code_email`;

  async saveVerificationCode(
    email: UserEmail,
    code: EmailVerifyCode,
  ): Promise<void> {
    const redis = this.cacheService.getRedis();
    await redis.set(
      `${this.EMAIL_VERIFY_CODE_KEY_NAME}:${email.value}`,
      code.value,
      'EX',
      this.EMAIL_VERIFY_CODE_EXPIRE_TIME,
    );
  }

  async verifyVerificationCode(
    email: UserEmail,
    code: EmailVerifyCode,
  ): Promise<boolean> {
    const redis = this.cacheService.getRedis();

    const value = await redis.get(
      `${this.EMAIL_VERIFY_CODE_KEY_NAME}:${email.value}`,
    );
    return value === code.value;
  }
}
