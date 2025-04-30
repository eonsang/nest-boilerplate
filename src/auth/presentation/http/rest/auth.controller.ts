import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  CheckDuplicateEmailService,
  SendEmailVerifyCodeService,
  SignupService,
} from 'src/auth/application/service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { EmailSignupDto, CheckDuplicateEmailDto, SendEmailVerifyCodeDto } from './dto';
import { IsPublicRoute } from 'src/common';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly sendEmailVerifyCodeService: SendEmailVerifyCodeService,
    private readonly checkDuplicateEmailService: CheckDuplicateEmailService,
    private readonly signupEmailService: SignupService,
  ) {}

  @ApiOperation({ summary: '이메일 중복 확인' })
  @IsPublicRoute()
  @Get('check-duplicate-email')
  async checkDuplicateEmail(@Query() query: CheckDuplicateEmailDto) {
    const response = await this.checkDuplicateEmailService.execute(query.email);
    if (response.isErr()) {
      throw new BadRequestException(response.error.code);
    }

    return response.value;
  }

  @ApiOperation({ summary: '이메일 인증 코드 발송' })
  @IsPublicRoute()
  @Post('send-email-verify-code')
  async sendEmailVerifyCode(@Body() body: SendEmailVerifyCodeDto) {
    const response = await this.sendEmailVerifyCodeService.execute(body.email);
    if (response.isErr()) {
      throw new BadRequestException(response.error.code);
    }

    return response.value;
  }

  @ApiOperation({ summary: '이메일 회원가입' })
  @IsPublicRoute()
  @Post('signup/email')
  async signupEmail(@Body() body: EmailSignupDto) {
    const response = await this.signupEmailService.execute(body);
    if (response.isErr()) {
      throw new BadRequestException(response.error.code);
    }

    return response.value;
  }
}
