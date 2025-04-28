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
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class SendEmailVerifyCodeService {
  constructor(
    @Inject(EMAIL_SENDER) private readonly emailSender: EmailSenderOutPort,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(EMAIL_VERIFICATION_STORE)
    private readonly emailVerificationStore: EmailVerificationStoreOutPort,
  ) {}

  @Transactional()
  async execute(email: string): Promise<Result<boolean, AuthError>> {
    const userEmail = UserEmail.create(email);
    if (userEmail.isErr()) {
      return err(AuthError.INVALID_EMAIL);
    }

    const randomCode = random(6, 'numeric');
    const emailVerifyCode = EmailVerifyCode.create(randomCode);
    if (emailVerifyCode.isErr()) {
      return err(AuthError.INVALID_CODE);
    }

    const isExists = await this.userRepository.existsByEmail(userEmail.value);
    if (isExists) {
      return err(AuthError.EXISTS_EMAIL);
    }

    await this.emailVerificationStore.saveVerificationCode(
      userEmail.value,
      emailVerifyCode.value,
    );

    await this.emailSender.sendEmailVerifyCode(
      userEmail.value,
      emailVerifyCode.value,
    );

    return ok(true);
  }
}
