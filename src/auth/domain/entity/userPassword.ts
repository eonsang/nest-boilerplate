import { matches } from 'class-validator';
import { err, ok, Result } from 'neverthrow';
import { PASSWORD_REGEX } from 'src/constants';
export class UserPassword {
  private constructor(private readonly _password: string) {}

  get value(): string {
    return this._password;
  }

  static create(password: string): Result<UserPassword, string> {
    if (!matches(password, PASSWORD_REGEX)) {
      return err('invalid password');
    }
    return ok(new UserPassword(password));
  }
}
