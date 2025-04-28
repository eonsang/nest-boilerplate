import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { SendEmailVerifyCodeService } from 'src/auth/application/service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly sendEmailVerifyCodeService: SendEmailVerifyCodeService,
  ) {}

  @Post('email-verify-code')
  async sendEmailVerifyCode(@Body() body: { email: string }) {
    const response = await this.sendEmailVerifyCodeService.execute(body.email);
    if (response.isErr()) {
      throw new BadRequestException(response.error.code);
    }

    return response.value;
  }
}
