import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { CacheModule } from './common/cache/cache.module';

@Module({
  imports: [PrismaModule, CacheModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
