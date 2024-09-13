import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app/app.module';
describe('PrismaHealthIndicator (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('should return healthy status from PrismaHealthIndicator', async () => {
        const response = await request(app.getHttpServer())
            .get('/health')
            .expect(200);

        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toBe('ok');
        expect(response.body.info).toHaveProperty('prisma');
        expect(response.body.info.prisma.status).toBe('up');
    });

    afterAll(async () => {
        await app.close();
    });
});
