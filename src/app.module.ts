import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { CacheModule } from './common/cache/cache.module';
import { LoggerModule } from 'nestjs-pino';
import { LocalStorageModule } from './common/localStorage/localStorage.module';

@Module({
  imports: [
    LocalStorageModule,
    LoggerModule,
    PrismaModule,
    CacheModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
