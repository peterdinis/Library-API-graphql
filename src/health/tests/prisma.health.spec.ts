import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('PrismaHealthIndicator (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Import the AppModule or the relevant module that includes HealthController and PrismaHealthIndicator
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  it('should return healthy status from PrismaHealthIndicator', async () => {
    // Mocking or ensuring a working database connection
    // You might want to clean or seed the database as needed for the test

    // Make a GET request to the health check endpoint
    const response = await request(app.getHttpServer())
      .get('/health')
      .expect(200);

    // Check if the response has the expected structure and contains the Prisma status
    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe('ok');
    expect(response.body.info).toHaveProperty('prisma');
    expect(response.body.info.prisma.status).toBe('up');
  });

  afterAll(async () => {
    await app.close();
  });
});