import { Result, err, ok } from 'neverthrow';

export class EmailVerifyCode {
  private constructor(private readonly _code: string) {}

  get code(): string {
    return this._code;
  }

  static create(code: string): Result<EmailVerifyCode, string> {
    if (code.length !== 6) {
      return err(`Invalid code: ${code}`);
    }
    return ok(new EmailVerifyCode(code));
  }
}
