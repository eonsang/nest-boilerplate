import { EmailVerifyCode } from './emailVerifyCode';

describe('EmailVerifyCode', () => {
  it('6자리 숫자로 이루어진 문자열이면, 성공한다.', () => {
    const emailVerifyCode = EmailVerifyCode.create('123456');
    expect(emailVerifyCode.isOk()).toBe(true);
  });

  it('6자리 숫자로 이루어진 문자열이 아니면, 실패한다.', () => {
    const emailVerifyCode = EmailVerifyCode.create('1234567');
    expect(emailVerifyCode.isErr()).toBe(true);
  });
});
