import { EmailVerifyCode, UserEmail } from 'src/auth/domain/entity';

export const EMAIL_VERIFICATION_STORE = Symbol('EMAIL_VERIFICATION_STORE');

export interface EmailVerificationStoreOutPort {
  save(email: UserEmail, code: EmailVerifyCode): Promise<void>;
  verify(email: UserEmail, code: EmailVerifyCode): Promise<boolean>;
}
