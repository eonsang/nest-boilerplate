import { Inject, Injectable } from '@nestjs/common';
import { EmailSignupUser, UserEmail, UserPassword } from 'src/auth/domain/entity';
import { err, ok } from 'neverthrow';
import {
  AUTH_REPOSITORY,
  AuthRepository,
  USER_REPOSITORY,
  UserRepository,
} from 'src/auth/domain/repository';
import { AuthError } from '../error';
import { EmailSignupDto, EmailSignupInPort } from '../port/in/emailSignup.inPort';
import { EMAIL_SENDER, EmailSenderOutPort } from '../port/out';
import { GenerateJwtService } from './generateJwt.service';

@Injectable()
export class SignupService implements EmailSignupInPort {
  constructor(
    private readonly jwtService: GenerateJwtService,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(EMAIL_SENDER) private readonly emailSender: EmailSenderOutPort,
    @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
  ) {}

  async execute(body: EmailSignupDto) {
    const userEmail = UserEmail.create(body.email);
    if (userEmail.isErr()) return err(AuthError.INVALID_EMAIL);

    const userPassword = UserPassword.create(body.password);
    if (userPassword.isErr()) return err(AuthError.INVALID_PASSWORD);

    const isExistsEmail = await this.userRepository.existsByEmail(userEmail.value);
    if (isExistsEmail) return err(AuthError.EXISTS_EMAIL);

    const emailSignupUser = EmailSignupUser.create({
      email: userEmail.value,
      password: userPassword.value,
    });
    if (emailSignupUser.isErr()) return err(AuthError.INVALID_EMAIL);
    const user = await this.userRepository.createUser(emailSignupUser.value);

    const result = await this.jwtService.generate(user);
    await this.authRepository.saveRefreshToken(user, result.refreshToken);

    await this.emailSender.sendWelcomeEmail(userEmail.value);

    return ok({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  }
}
