import { Enum, EnumType } from 'ts-jenum';

@Enum('code')
export class AuthError extends EnumType<AuthError>() {
  static readonly EXISTS_EMAIL = new AuthError('EXISTS_EMAIL', '이미 존재하는 이메일입니다.');

  static readonly INVALID_EMAIL = new AuthError(
    'INVALID_EMAIL',
    '이메일 형식이 올바르지 않습니다.',
  );

  static readonly INVALID_PASSWORD = new AuthError(
    'INVALID_PASSWORD',
    '비밀번호 형식이 올바르지 않습니다.',
  );

  static readonly INVALID_CODE = new AuthError(
    'INVALID_CODE',
    '인증 코드 형식이 올바르지 않습니다.',
  );

  private constructor(
    readonly code: string,
    readonly text: string,
  ) {
    super();
  }
}
