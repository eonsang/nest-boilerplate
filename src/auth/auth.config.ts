import { Injectable } from '@nestjs/common';
import { AbstractConfigService } from '@nestjs-library/config';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

@Injectable()
export class AuthConfig extends AbstractConfigService<AuthConfig> {
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'JWT_SECRET' })
  secret: string;
}
