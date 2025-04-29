import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendEmailVerifyCodeDto {
  @ApiProperty({
    description: 'email',
    example: 'test@test.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
