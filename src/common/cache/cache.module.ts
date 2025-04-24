import { DynamicModule, Global, Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule } from '@nestjs-library/config';
import { CacheConfigService } from './cacheConfig.service';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule.forFeature([CacheConfigService]) as DynamicModule],
      inject: [CacheConfigService],
      useFactory: (config: CacheConfigService) => {
        return {
          config: {
            host: config.host,
            port: config.port,
          },
        };
      },
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
