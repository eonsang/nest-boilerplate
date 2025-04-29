import { Result, ok } from 'neverthrow';

export class User {
  private constructor(
    readonly id: string,
    readonly email: string,
  ) {}

  static create(body: { id: string; email: string }): Result<User, string> {
    return ok(new User(body.id, body.email));
  }
}
