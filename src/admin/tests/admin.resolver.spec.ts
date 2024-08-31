import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app/app.module';
import { AdminService } from '../admin.service';

describe('AdminResolver (e2e)', () => {
    let app: INestApplication;
    let adminService: AdminService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        adminService = moduleFixture.get<AdminService>(AdminService);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Mutation', () => {
        it('should delete all authors', async () => {
            const response = await request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: `
              mutation {
                deleteAllAuthors
              }
            `,
                })
                .expect(200);

            expect(response.body.data.deleteAllAuthors).toBe(true);
        });

        it('should delete all publishers', async () => {
            const response = await request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: `
              mutation {
                deleteAllPublishers
              }
            `,
                })
                .expect(200);

            expect(response.body.data.deleteAllPublishers).toBe(true);
        });

        it('should delete all categories', async () => {
            const response = await request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: `
              mutation {
                deleteAllCategories
              }
            `,
                })
                .expect(200);

            expect(response.body.data.deleteAllCategories).toBe(true);
        });
    });

    describe('Query', () => {
        it('should download books as sheets', async () => {
            const mockBuffer = Buffer.from('mock data');
            jest.spyOn(adminService, 'downloadBookAsSheets').mockResolvedValue(
                mockBuffer,
            );

            const response = await request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: `
              query {
                downloadBooksAsSheets {
                  content
                }
              }
            `,
                })
                .expect(200);

            expect(response.headers['content-type']).toBe(
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            );
            expect(response.headers['content-disposition']).toBe(
                'attachment; filename="books.xlsx"',
            );
            expect(response.body.data.downloadBooksAsSheets).toEqual({
                content: mockBuffer.toString(),
            });
        });

        it('should download students as sheets', async () => {
            const mockBuffer = Buffer.from('mock data');
            jest.spyOn(
                adminService,
                'downloadStudentsAsSheets',
            ).mockResolvedValue(mockBuffer);

            const response = await request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: `
              query {
                downloadStudentsAsSheets {
                  content
                }
              }
            `,
                })
                .expect(200);

            expect(response.headers['content-type']).toBe(
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            );
            expect(response.headers['content-disposition']).toBe(
                'attachment; filename="students.xlsx"',
            );
            expect(response.body.data.downloadStudentsAsSheets).toEqual({
                content: mockBuffer.toString(),
            });
        });

        it('should download teachers as sheets', async () => {
            const mockBuffer = Buffer.from('mock data');
            jest.spyOn(
                adminService,
                'downloadTeacherAsSheets',
            ).mockResolvedValue(mockBuffer);

            const response = await request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: `
              query {
                downloadTeachersAsSheets {
                  content
                }
              }
            `,
                })
                .expect(200);

            expect(response.headers['content-type']).toBe(
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            );
            expect(response.headers['content-disposition']).toBe(
                'attachment; filename="teachers.xlsx"',
            );
            expect(response.body.data.downloadTeachersAsSheets).toEqual({
                content: mockBuffer.toString(),
            });
        });

        it('should download bookings as sheets', async () => {
            const mockBuffer = Buffer.from('mock data');
            jest.spyOn(
                adminService,
                'downloadBookingAsSheets',
            ).mockResolvedValue(mockBuffer);

            const response = await request(app.getHttpServer())
                .post('/graphql')
                .send({
                    query: `
              query {
                downloadBookingsAsSheets {
                  content
                }
              }
            `,
                })
                .expect(200);

            expect(response.headers['content-type']).toBe(
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            );
            expect(response.headers['content-disposition']).toBe(
                'attachment; filename="bookings.xlsx"',
            );
            expect(response.body.data.downloadBookingsAsSheets).toEqual({
                content: mockBuffer.toString(),
            });
        });
    });
});
