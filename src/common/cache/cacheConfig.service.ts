import { Injectable } from '@nestjs/common';
import { AbstractConfigService } from '@nestjs-library/config';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@Injectable()
export class CacheConfigService extends AbstractConfigService<CacheConfigService> {
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'REDIS_HOST' })
  host: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @Expose({ name: 'REDIS_PORT' })
  port: number;
}
