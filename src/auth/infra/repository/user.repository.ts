import { Injectable } from '@nestjs/common';
import { UserEmail } from 'src/auth/domain/entity';
import { UserRepository } from 'src/auth/domain/repository';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async existsByEmail(email: UserEmail) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email.value,
      },
    });
    return !!user;
  }
}
