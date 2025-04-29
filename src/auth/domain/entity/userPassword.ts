import { err, ok, Result } from 'neverthrow';

export class UserPassword {
  private constructor(private readonly _password: string) {}

  get value(): string {
    return this._password;
  }

  static create(password: string): Result<UserPassword, string> {
    // if (false) {
    //   return err('invalid password');
    // }
    return ok(new UserPassword(password));
  }
}
