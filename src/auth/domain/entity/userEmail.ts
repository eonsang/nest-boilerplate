import { isEmail } from 'class-validator';
import { err, ok, Result } from 'neverthrow';

export class UserEmail {
  private constructor(private readonly _email: string) {}

  get value(): string {
    return this._email;
  }

  static create(email: string): Result<UserEmail, string> {
    if (!isEmail(email)) {
      return err(`invalid email: ${email}`);
    }
    return ok(new UserEmail(email));
  }
}
