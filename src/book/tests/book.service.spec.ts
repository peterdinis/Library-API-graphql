import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppModule } from 'src/app/app.module';

describe('BookService (e2e)', () => {
    let app: INestApplication;
    let prismaService: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        prismaService = moduleFixture.get<PrismaService>(PrismaService);
        await app.init();
    });

    // Setup and teardown for database state
    beforeEach(async () => {
        await prismaService.book.deleteMany(); // Clean up books before each test
        await prismaService.category.createMany({
            data: [
                { id: 1, name: 'Fiction' },
                { id: 2, name: 'Non-Fiction' },
            ],
        });
        await prismaService.author.createMany({
            data: [
                {
                    id: 1,
                    name: 'Author 1',
                    description: 'Author Desc 1',
                },
                {
                    id: 2,
                    name: 'Author 2',
                    description: 'Author Desc 2',
                },
            ],
        });
        await prismaService.publisher.createMany({
            data: [
                {
                    id: 1,
                    name: 'Publisher 1',
                    description: '',
                    image: '',
                },
                {
                    id: 2,
                    name: 'Publisher 2',
                    description: '',
                    image: '',
                },
            ],
        });
    });

    afterAll(async () => {
        await app.close();
    });

    it('/books (GET) - should return all books', async () => {
        await prismaService.book.createMany({
            data: [
                {
                    id: 1,
                    name: 'Book 1',
                    description: 'Description of Book 1',
                    image: 'http://example.com/image1.jpg',
                    pages: 300,
                    authorName: 'Author 1',
                    isAvaiable: true,
                    isBorrowed: false,
                    isReturned: false,
                    stockNumber: 10,
                    serialNumber: '11-22-111',
                    categoryId: 1,
                    authorId: 1,
                    publisherId: 1,
                },
                {
                    id: 2,
                    name: 'Book 2',
                    description: 'Description of Book 2',
                    image: 'http://example.com/image2.jpg',
                    pages: 250,
                    authorName: 'Author 2',
                    isAvaiable: false,
                    isBorrowed: true,
                    isReturned: false,
                    stockNumber: 5,
                    serialNumber: '22-33-444',
                    categoryId: 2,
                    authorId: 2,
                    publisherId: 2,
                },
            ],
        });

        const response = await request(app.getHttpServer())
            .get('/books')
            .expect(200);

        expect(response.body).toHaveLength(2);
        expect(response.body[0]).toMatchObject({
            name: 'Book 1',
            description: 'Description of Book 1',
            image: 'http://example.com/image1.jpg',
            pages: 300,
            authorName: 'Author 1',
            isAvaiable: true,
            isBorrowed: false,
            isReturned: false,
            stockNumber: 10,
            serialNumber: '11-22-111',
            categoryId: 1,
            authorId: 1,
            publisherId: 1,
        });
    });

    it('/books/:id (GET) - should return a specific book', async () => {
        const book = await prismaService.book.create({
            data: {
                id: 1,
                name: 'Single Book',
                description: 'Description of Single Book',
                image: 'http://example.com/image_single.jpg',
                pages: 100,
                authorName: 'Author Single',
                isAvaiable: true,
                isBorrowed: false,
                isReturned: false,
                stockNumber: 1,
                serialNumber: '33-44-555',
                categoryId: 1,
                authorId: 1,
                publisherId: 1,
            },
        });

        const response = await request(app.getHttpServer())
            .get(`/books/${book.id}`)
            .expect(200);

        expect(response.body).toMatchObject({
            name: 'Single Book',
            description: 'Description of Single Book',
            image: 'http://example.com/image_single.jpg',
            pages: 100,
            authorName: 'Author Single',
            isAvaiable: true,
            isBorrowed: false,
            isReturned: false,
            stockNumber: 1,
            serialNumber: '33-44-555',
            categoryId: 1,
            authorId: 1,
            publisherId: 1,
        });
    });

    it('/books (POST) - should create a new book', async () => {
        const response = await request(app.getHttpServer())
            .post('/books')
            .send({
                name: 'New Book',
                description: 'New book description',
                image: 'http://example.com/new_book.jpg',
                pages: 150,
                authorName: 'New Author',
                isAvaiable: true,
                isBorrowed: false,
                isReturned: false,
                stockNumber: 20,
                serialNumber: '44-55-666',
                categoryId: 1,
                authorId: 1,
                publisherId: 1,
            })
            .expect(201);

        expect(response.body).toMatchObject({
            name: 'New Book',
            description: 'New book description',
            image: 'http://example.com/new_book.jpg',
            pages: 150,
            authorName: 'New Author',
            isAvaiable: true,
            isBorrowed: false,
            isReturned: false,
            stockNumber: 20,
            serialNumber: '44-55-666',
            categoryId: 1,
            authorId: 1,
            publisherId: 1,
        });
    });

    it('/books/:id (PUT) - should update an existing book', async () => {
        const book = await prismaService.book.create({
            data: {
                id: 1,
                name: 'Old Book',
                description: 'Old description',
                image: 'http://example.com/old_book.jpg',
                pages: 200,
                authorName: 'Old Author',
                isAvaiable: true,
                isBorrowed: false,
                isReturned: false,
                stockNumber: 15,
                serialNumber: '55-66-777',
                categoryId: 1,
                authorId: 1,
                publisherId: 1,
            },
        });

        const response = await request(app.getHttpServer())
            .put(`/books/${book.id}`)
            .send({
                name: 'Updated Book',
                description: 'Updated description',
                image: 'http://example.com/updated_book.jpg',
                pages: 250,
                authorName: 'Updated Author',
                isAvaiable: false,
                isBorrowed: true,
                isReturned: true,
                stockNumber: 25,
                serialNumber: '66-77-888',
            })
            .expect(200);

        expect(response.body).toMatchObject({
            name: 'Updated Book',
            description: 'Updated description',
            image: 'http://example.com/updated_book.jpg',
            pages: 250,
            authorName: 'Updated Author',
            isAvaiable: false,
            isBorrowed: true,
            isReturned: true,
            stockNumber: 25,
            serialNumber: '66-77-888',
        });
    });

    it('/books/:id (DELETE) - should delete an existing book', async () => {
        const book = await prismaService.book.create({
            data: {
                id: 1,
                name: 'Book to Delete',
                description: 'Description to Delete',
                image: 'http://example.com/delete_book.jpg',
                pages: 400,
                authorName: 'Author to Delete',
                isAvaiable: true,
                isBorrowed: false,
                isReturned: false,
                stockNumber: 30,
                serialNumber: '77-88-999',
                categoryId: 1,
                authorId: 1,
                publisherId: 1,
            },
        });

        await request(app.getHttpServer())
            .delete(`/books/${book.id}`)
            .expect(200);

        const response = await request(app.getHttpServer())
            .get(`/books/${book.id}`)
            .expect(404);

        expect(response.body).toHaveProperty('statusCode', 404);
    });

    it('/books/search (GET) - should return books matching the keyword', async () => {
        await prismaService.book.createMany({
            data: [
                {
                    id: 1,
                    name: 'Searchable Book One',
                    description: 'Description for Searchable Book One',
                    image: 'http://example.com/searchable_book_one.jpg',
                    pages: 320,
                    authorName: 'Author Searchable',
                    isAvaiable: true,
                    isBorrowed: false,
                    isReturned: false,
                    stockNumber: 12,
                    serialNumber: '88-99-000',
                    categoryId: 1,
                    authorId: 1,
                    publisherId: 1,
                },
                {
                    id: 2,
                    name: 'Searchable Book Two',
                    description: 'Description for Searchable Book Two',
                    image: 'http://example.com/searchable_book_two.jpg',
                    pages: 220,
                    authorName: 'Author Searchable',
                    isAvaiable: true,
                    isBorrowed: false,
                    isReturned: false,
                    stockNumber: 8,
                    serialNumber: '99-00-111',
                    categoryId: 2,
                    authorId: 2,
                    publisherId: 2,
                },
            ],
        });

        const response = await request(app.getHttpServer())
            .get('/books/search?keyword=Searchable')
            .expect(200);

        expect(response.body).toHaveLength(2);
        expect(response.body[0]).toMatchObject({
            name: 'Searchable Book One',
        });
        expect(response.body[1]).toMatchObject({
            name: 'Searchable Book Two',
        });
    });

    it('/books/pagination (GET) - should paginate books', async () => {
        await prismaService.book.createMany({
            data: [
                {
                    id: 1,
                    name: 'Book 1',
                    categoryId: 1,
                    authorId: 1,
                    publisherId: 1,
                    description: '',
                    image: '',
                    pages: 0,
                    authorName: '',
                },
                {
                    id: 2,
                    name: 'Book 2',
                    categoryId: 1,
                    authorId: 1,
                    publisherId: 1,
                    description: '',
                    image: '',
                    pages: 0,
                    authorName: '',
                },
                {
                    id: 3,
                    name: 'Book 3',
                    categoryId: 1,
                    authorId: 1,
                    publisherId: 1,
                    description: '',
                    image: '',
                    pages: 0,
                    authorName: '',
                },
                {
                    id: 4,
                    name: 'Book 4',
                    categoryId: 1,
                    authorId: 1,
                    publisherId: 1,
                    description: '',
                    image: '',
                    pages: 0,
                    authorName: '',
                },
                {
                    id: 5,
                    name: 'Book 5',
                    categoryId: 1,
                    authorId: 1,
                    publisherId: 1,
                    description: '',
                    image: '',
                    pages: 0,
                    authorName: '',
                },
            ],
        });

        const response = await request(app.getHttpServer())
            .get('/books/pagination?skip=2&take=2')
            .expect(200);

        expect(response.body).toHaveLength(2);
        expect(response.body[0]).toMatchObject({
            name: 'Book 3',
        });
        expect(response.body[1]).toMatchObject({
            name: 'Book 4',
        });
    });
});
