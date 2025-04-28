import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { CacheModule } from './common/cache/cache.module';
import { LoggerModule } from 'nestjs-pino';
import { ClsModule } from 'nestjs-cls';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { v7 as uuidv7 } from 'uuid';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { PrismaService } from './common/prisma/prisma.service';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: (req: Request) => {
          return (req.headers['x-transaction-id'] as string) ?? uuidv7();
        },
      },
      plugins: [
        new ClsPluginTransactional({
          imports: [PrismaModule],
          adapter: new TransactionalAdapterPrisma({
            prismaInjectionToken: PrismaService,
          }),
        }),
      ],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        name: 'pino-http',
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
      },
    }),
    PrismaModule,
    CacheModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
