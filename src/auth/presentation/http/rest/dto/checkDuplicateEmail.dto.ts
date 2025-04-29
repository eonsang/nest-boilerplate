import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CheckDuplicateEmailDto {
  @ApiProperty({
    description: 'email',
    example: 'test@test.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
