import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthCheckController } from './healthCheck.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    TerminusModule.forRoot({
      logger: false,
      errorLogStyle: 'pretty',
    }),
  ],
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}
