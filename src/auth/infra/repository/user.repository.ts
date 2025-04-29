import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import { EmailSignupUser, User, UserEmail } from 'src/auth/domain/entity';
import { UserRepository } from 'src/auth/domain/repository';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma<PrismaService>>,
  ) {}

  async existsByEmail(email: UserEmail) {
    const result = await this.txHost.tx.user.findUnique({
      where: {
        email: email.value,
      },
    });
    return !!result;
  }

  async createUser(user: EmailSignupUser) {
    await Promise.resolve();

    const result = User.create({
      id: '1',
      email: user.email.value,
    });
    if (result.isErr()) throw new Error('User creation failed');
    return result.value;
  }
}
