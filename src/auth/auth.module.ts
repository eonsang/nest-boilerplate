import { Module } from '@nestjs/common';
import { AuthController } from './presentation/http/rest/auth.controller';
@Module({
  imports: [],
  providers: [],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
