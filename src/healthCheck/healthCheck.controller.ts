import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Controller('health-check')
export class HealthCheckController {
  constructor(
    private readonly health: HealthCheckService,
    private http: HttpHealthIndicator,
    private prisma: PrismaHealthIndicator,
    private prismaService: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => {
        return this.prisma.pingCheck('prisma', this.prismaService);
      },
    ]);
  }
}
