import { DynamicModule, Module } from '@nestjs/common';
import { AuthController } from './presentation/http/rest/auth.controller';
import { UserPrismaRepository } from './infra/repository/user.repository';
import { AUTH_REPOSITORY, USER_REPOSITORY } from './domain/repository';
import {
  CheckDuplicateEmailService,
  GenerateJwtService,
  SendEmailVerifyCodeService,
  SignupService,
} from './application/service';
import { EMAIL_SENDER, EMAIL_VERIFICATION_STORE } from './application/port/out';
import { EmailSender } from './infra/email/emailSender';
import { AuthRepository } from './infra/repository/auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs-library/config';
import { AuthConfig } from 'src/auth/auth.config';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature([AuthConfig]) as DynamicModule],
      useFactory: (authConfig: AuthConfig) => ({
        global: true,
        secret: authConfig.secret,
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [
    SendEmailVerifyCodeService,
    CheckDuplicateEmailService,
    SignupService,
    GenerateJwtService,

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
    {
      provide: AUTH_REPOSITORY,
      useClass: AuthRepository,
    },
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
