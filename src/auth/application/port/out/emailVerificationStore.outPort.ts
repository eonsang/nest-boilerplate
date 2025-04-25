export const EMAIL_VERIFICATION_STORE = Symbol('EMAIL_VERIFICATION_STORE');

export interface EmailVerificationStoreOutPort {
  save(email: string, code: string): Promise<void>;
  verify(email: string, code: string): Promise<boolean>;
}
