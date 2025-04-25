import { Module } from '@nestjs/common';
import { AuthController } from './presentation/http/rest/auth.controller';
import { UserPrismaRepository } from './infra/repository/user.repository';
import { USER_REPOSITORY } from './domain/repository';
@Module({
  imports: [],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
