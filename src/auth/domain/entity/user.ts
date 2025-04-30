import { Result, err, ok } from 'neverthrow';
import { UserEmail } from './userEmail';

export class User {
  private constructor(
    readonly id: string,
    readonly email: UserEmail,
  ) {}

  static create(body: { id: string; email: string }): Result<User, string> {
    const userEmail = UserEmail.create(body.email);
    if (userEmail.isErr()) return err('invalid email');

    return ok(new User(body.id, userEmail.value));
  }
}
