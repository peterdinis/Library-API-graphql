import { PrismaModule } from './../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { PrismaHealthIndicator } from './prisma.health.service';

@Module({
    imports: [
        PrismaModule,
        TerminusModule.forRoot({
            logger: true,
            errorLogStyle: 'pretty',
        }),
        HttpModule,
    ],
    controllers: [HealthController],
    providers: [PrismaHealthIndicator],
})
export class HealthModule {}
