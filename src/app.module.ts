import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { CacheModule } from './common/cache/cache.module';
import { LocalStorageModule } from './common/localStorage/localStorage.module';
import { HealthCheckModule } from './healthCheck/healthCheck.module';
import { LoggerModule } from './common/logger/logger.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common';

@Module({
  imports: [
    LocalStorageModule,
    LoggerModule,
    PrismaModule,
    CacheModule,
    HealthCheckModule,

    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
