import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Get()
  register() {
    return { message: 'Ok' };
  }
}
