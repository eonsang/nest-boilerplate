import { Inject, Injectable } from '@nestjs/common';

import { UserEmail, UserPassword } from 'src/auth/domain/entity';
import { err, ok } from 'neverthrow';
import { USER_REPOSITORY, UserRepository } from 'src/auth/domain/repository';
import { AuthError } from '../error';
import { EmailSignupDto, EmailSignupInPort } from '../port/in/emailSignup.inPort';

@Injectable()
export class SignupService implements EmailSignupInPort {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}

  async execute(body: EmailSignupDto) {
    const { email, password } = body;
    const userEmail = UserEmail.create(email);
    if (userEmail.isErr()) return err(AuthError.INVALID_EMAIL);

    const userPassword = UserPassword.create(password);
    if (userPassword.isErr()) return err(AuthError.INVALID_PASSWORD);

    const isExistsEmail = await this.userRepository.existsByEmail(userEmail.value);
    if (isExistsEmail) return err(AuthError.EXISTS_EMAIL);

    // 회원가입

    // 회원가입 웰컴메일 전송

    return ok(true);
  }
}
