import { Test, TestingModule } from '@nestjs/testing';
import {
    HealthCheckService,
    HttpHealthIndicator,
    MemoryHealthIndicator,
    PrismaHealthIndicator,
} from '@nestjs/terminus';
import { HealthController } from '../health.controller';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('HealthController', () => {
    let healthController: HealthController;
    let healthCheckService: HealthCheckService;
    let httpHealthIndicator: HttpHealthIndicator;
    let prismaHealthIndicator: PrismaHealthIndicator;
    let memoryHealthIndicator: MemoryHealthIndicator;
    let app: INestApplication;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [HealthController],
            providers: [
                {
                    provide: HealthCheckService,
                    useValue: {
                        check: jest.fn(),
                    },
                },
                {
                    provide: HttpHealthIndicator,
                    useValue: {
                        pingCheck: jest.fn(),
                    },
                },
                {
                    provide: PrismaHealthIndicator,
                    useValue: {
                        isHealthy: jest.fn(),
                    },
                },
                {
                    provide: MemoryHealthIndicator,
                    useValue: {
                        checkHeap: jest.fn(),
                    },
                },
            ],
        }).compile();

        healthController = module.get<HealthController>(HealthController);
        healthCheckService = module.get<HealthCheckService>(HealthCheckService);
        httpHealthIndicator =
            module.get<HttpHealthIndicator>(HttpHealthIndicator);
        prismaHealthIndicator = module.get<PrismaHealthIndicator>(
            PrismaHealthIndicator,
        );
        memoryHealthIndicator = module.get<MemoryHealthIndicator>(
            MemoryHealthIndicator,
        );
    });

    describe('Health E2e Tests', () => {
        it('/health (GET)', async () => {
            const response = await request(app.getHttpServer())
                .get('/health')
                .expect(200);

            // Check if the response has the correct structure and status
            expect(response.body).toHaveProperty('status');
            expect(response.body.status).toBe('ok');
            expect(response.body).toHaveProperty('info');
            expect(response.body).toHaveProperty('error');
            expect(response.body).toHaveProperty('details');
        });

        it('should handle errors from health check', async () => {
            const error = new Error('Health check failed');
            jest.spyOn(healthCheckService, 'check').mockRejectedValue(error);

            try {
                await healthController.check();
            } catch (e) {
                expect(e).toBe(error);
            }
        });
    });
});
