import { ok, Result } from 'neverthrow';
import { UserEmail } from './userEmail';
import { UserPassword } from './userPassword';

export class EmailSignupUser {
  constructor(
    readonly email: UserEmail,
    readonly password: UserPassword,
  ) {}

  static create(body: {
    email: UserEmail;
    password: UserPassword;
  }): Result<EmailSignupUser, string> {
    return ok(new EmailSignupUser(body.email, body.password));
  }
}
