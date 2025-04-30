import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';
import { PASSWORD_REGEX } from 'src/constants';

export class EmailSignupDto {
  @ApiProperty({
    description: '이메일',
    example: 'test@test.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'password',
  })
  @IsString()
  @Matches(PASSWORD_REGEX)
  password: string;
}
