import { Result, ok } from 'neverthrow';

export class User {
  private constructor(
    private readonly _id: string,
    private readonly _email: string,
  ) {}

  static create(body: { id: string; email: string }): Result<User, string> {
    return ok(new User(body.id, body.email));
  }
}
