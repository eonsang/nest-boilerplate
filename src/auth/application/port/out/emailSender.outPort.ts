import { EmailVerifyCode, UserEmail } from 'src/auth/domain/entity';

export const EMAIL_SENDER = Symbol('EMAIL_SENDER');

export interface EmailSenderOutPort {
  sendEmailVerifyCode(email: UserEmail, code: EmailVerifyCode): Promise<void>;
  sendWelcomeEmail(email: UserEmail): Promise<void>;
}
