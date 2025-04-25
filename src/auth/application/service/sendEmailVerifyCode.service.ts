import { Inject, Injectable } from '@nestjs/common';
import { err, ok, Result } from 'neverthrow';
import random from 'random-string-generator';
import { AuthError } from '../error';
import {
  EMAIL_SENDER,
  EmailSenderOutPort,
  EMAIL_VERIFICATION_STORE,
  EmailVerificationStoreOutPort,
} from '../port/out';
import { UserEmail, EmailVerifyCode } from 'src/auth/domain/entity';
import { USER_REPOSITORY, UserRepository } from 'src/auth/domain/repository';

@Injectable()
export class SendEmailVerifyCodeService {
  constructor(
    @Inject(EMAIL_SENDER) private readonly emailSender: EmailSenderOutPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(EMAIL_VERIFICATION_STORE)
    private readonly emailVerificationStore: EmailVerificationStoreOutPort,
  ) {}

  async execute(email: string): Promise<Result<boolean, AuthError>> {
    const userEmail = UserEmail.create(email);
    if (userEmail.isErr()) {
      return err(AuthError.INVALID_EMAIL);
    }

    const emailVerifyCode = EmailVerifyCode.create(random(6, 'numeric'));
    if (emailVerifyCode.isErr()) {
      return err(AuthError.INVALID_CODE);
    }

    const isExists = await this.userRepository.existsByEmail(userEmail.value);
    if (isExists) {
      return err(AuthError.EXISTS_EMAIL);
    }

    await this.emailVerificationStore.save(
      userEmail.value.email,
      emailVerifyCode.value.code,
    );

    await this.emailSender.sendEmailVerifyCode(
      userEmail.value.email,
      emailVerifyCode.value.code,
    );

    return ok(true);
  }
}
