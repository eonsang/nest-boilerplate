import { Module } from '@nestjs/common';
import { AuthController } from './presentation/http/rest/auth.controller';
import { UserPrismaRepository } from './infra/repository/user.repository';
import { USER_REPOSITORY } from './domain/repository';
import {
  CheckDuplicateEmailService,
  SendEmailVerifyCodeService,
  SignupService,
} from './application/service';
import { EMAIL_SENDER, EMAIL_VERIFICATION_STORE } from './application/port/out';
import { EmailSender } from './infra/email/emailSender';
import { AuthRepository } from './infra/repository/auth.repository';
@Module({
  imports: [],
  providers: [
    SendEmailVerifyCodeService,
    CheckDuplicateEmailService,
    SignupService,

    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
    {
      provide: EMAIL_SENDER,
      useClass: EmailSender,
    },
    {
      provide: EMAIL_VERIFICATION_STORE,
      useClass: AuthRepository,
    },
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
