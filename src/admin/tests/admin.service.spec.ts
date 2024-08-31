import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app/app.module';
import { AuthService } from 'src/auth/auth.service';
import { AuthorsService } from 'src/authors/authors.service';
import { BookService } from 'src/book/book.service';
import { BookingService } from 'src/booking/booking.service';
import { CategoryService } from 'src/category/category.service';
import { PublisherService } from 'src/publisher/publisher.service';

describe('AdminService (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        BookService,
        CategoryService,
        AuthService,
        PublisherService,
        BookingService,
        AuthorsService,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should delete all authors', async () => {
    const query = `
      mutation {
        deleteAllAuthors {
          affected
        }
      }
    `;
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);
    expect(response.body.data.deleteAllAuthors.affected).toBeDefined();
  });

  it('should delete all publishers', async () => {
    const query = `
      mutation {
        deleteAllPublishers {
          affected
        }
      }
    `;
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);
    expect(response.body.data.deleteAllPublishers.affected).toBeDefined();
  });

  it('should delete all categories', async () => {
    const query = `
      mutation {
        deleteAllCategories {
          affected
        }
      }
    `;
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);
    expect(response.body.data.deleteAllCategories.affected).toBeDefined();
  });

  it('should download books as sheets', async () => {
    const query = `
      query {
        downloadBookAsSheets
      }
    `;
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);
    expect(response.headers['content-type']).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    expect(response.body).toBeInstanceOf(Buffer);
  });

  it('should download students as sheets', async () => {
    const query = `
      query {
        downloadStudentsAsSheets
      }
    `;
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);
    expect(response.headers['content-type']).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    expect(response.body).toBeInstanceOf(Buffer);
  });

  it('should download teachers as sheets', async () => {
    const query = `
      query {
        downloadTeacherAsSheets
      }
    `;
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);
    expect(response.headers['content-type']).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    expect(response.body).toBeInstanceOf(Buffer);
  });

  it('should download bookings as sheets', async () => {
    const query = `
      query {
        downloadBookingAsSheets
      }
    `;
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query })
      .expect(200);
    expect(response.headers['content-type']).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    expect(response.body).toBeInstanceOf(Buffer);
  });

  afterAll(async () => {
    await app.close();
  });
});