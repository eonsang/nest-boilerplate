import { Module } from '@nestjs/common';
import { AuthController } from './presentation/http/rest/auth.controller';
import { UserPrismaRepository } from './infra/repository/user.repository';
import { USER_REPOSITORY } from './domain/repository';
import { SendEmailVerifyCodeService } from './application/service';
import { EMAIL_SENDER } from './application/port/out';
import { EmailSender } from './infra/email/emailSender';
@Module({
  imports: [],
  providers: [
    SendEmailVerifyCodeService,
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
    {
      provide: EMAIL_SENDER,
      useClass: EmailSender,
    },
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
