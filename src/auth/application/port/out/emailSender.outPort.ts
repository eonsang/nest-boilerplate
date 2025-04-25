export const EMAIL_SENDER = Symbol('EMAIL_SENDER');

export interface EmailSenderOutPort {
  sendEmailVerifyCode(email: string, code: string): Promise<void>;
}
