import { Injectable } from '@nestjs/common';
import { EmailVerificationStoreOutPort } from 'src/auth/application/port/out';
import { UserEmail, EmailVerifyCode, User } from 'src/auth/domain/entity';
import { CacheService } from 'src/common/cache/cache.service';
import { AuthRepository as IAuthRepository } from 'src/auth/domain/repository';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class AuthRepository implements EmailVerificationStoreOutPort, IAuthRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>,
    private readonly cacheService: CacheService,
  ) {}

  private readonly EMAIL_VERIFY_CODE_EXPIRE_TIME = 60 * 5;
  private readonly EMAIL_VERIFY_CODE_KEY_NAME = `verify_code_email`;

  async saveVerificationCode(email: UserEmail, code: EmailVerifyCode): Promise<void> {
    const redis = this.cacheService.getRedis();
    await redis.set(
      `${this.EMAIL_VERIFY_CODE_KEY_NAME}:${email.value}`,
      code.value,
      'EX',
      this.EMAIL_VERIFY_CODE_EXPIRE_TIME,
    );
  }

  async verifyVerificationCode(email: UserEmail, code: EmailVerifyCode): Promise<boolean> {
    const redis = this.cacheService.getRedis();

    const value = await redis.get(`${this.EMAIL_VERIFY_CODE_KEY_NAME}:${email.value}`);
    return value === code.value;
  }

  async saveRefreshToken(user: User, refreshToken: string): Promise<void> {
    const findedUser = await this.txHost.tx.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });
    if (!findedUser) throw new Error('User not found');

    await this.txHost.tx.user.update({
      where: {
        id: findedUser.id,
      },
      data: {
        refreshToken,
      },
    });
  }
}
