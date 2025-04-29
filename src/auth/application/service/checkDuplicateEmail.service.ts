import { Inject, Injectable } from '@nestjs/common';
import { err, ok } from 'neverthrow';
import { UserEmail } from 'src/auth/domain/entity';
import { USER_REPOSITORY, UserRepository } from 'src/auth/domain/repository';
import { AuthError } from '../error';

@Injectable()
export class CheckDuplicateEmailService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {}
  async execute(email: string) {
    const userEmail = UserEmail.create(email);
    if (userEmail.isErr()) return err(AuthError.INVALID_EMAIL);

    const isExists = await this.userRepository.existsByEmail(userEmail.value);
    return ok(isExists);
  }
}
