import { Injectable } from '@nestjs/common';
import { EmailSenderOutPort } from 'src/auth/application/port/out';
import { EmailVerifyCode, UserEmail } from 'src/auth/domain/entity';

@Injectable()
export class EmailSender implements EmailSenderOutPort {
  async sendEmailVerifyCode(
    email: UserEmail,
    code: EmailVerifyCode,
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log(`Sending email verify code to ${email.value}: ${code.value}`);
  }
}
