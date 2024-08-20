import { Controller, Get } from '@nestjs/common';
import {
    HealthCheckService,
    HttpHealthIndicator,
    HealthCheck,
    MemoryHealthIndicator,
} from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma.health.service';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private prisma: PrismaHealthIndicator,
        private memory: MemoryHealthIndicator,
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
            () => this.prisma.isHealthy('prisma'),
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
        ]);
    }
}
