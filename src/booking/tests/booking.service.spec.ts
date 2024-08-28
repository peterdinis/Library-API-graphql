import { Test, TestingModule } from '@nestjs/testing';
import { formatISO } from 'date-fns';
import { faker } from '@faker-js/faker'; // Import Faker.js
import { AuthService } from 'src/auth/auth.service';
import { BookService } from 'src/book/book.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookingService } from '../booking.service';

describe('BookingService (e2e)', () => {
    let bookingService: BookingService;
    let prismaService: PrismaService;
    let authService: AuthService;
    let bookService: BookService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            providers: [
                BookingService,
                PrismaService,
                AuthService,
                BookService,
            ],
        }).compile();

        bookingService = moduleFixture.get<BookingService>(BookingService);
        prismaService = moduleFixture.get<PrismaService>(PrismaService);
        authService = moduleFixture.get<AuthService>(AuthService);
        bookService = moduleFixture.get<BookService>(BookService);

        // Clear the database to ensure tests are isolated
        await prismaService.$executeRaw`TRUNCATE TABLE "Booking" CASCADE;`;
        await prismaService.$executeRaw`TRUNCATE TABLE "User" CASCADE;`;
        await prismaService.$executeRaw`TRUNCATE TABLE "Book" CASCADE;`;
    });

    it('should paginate bookings', async () => {
        // Seed data with Faker
        for (let i = 0; i < 5; i++) {
            await prismaService.booking.create({
                data: {
                    bookName: faker.commerce.productName(),
                    userId: i + 1,
                    isReturned: faker.datatype.boolean(),
                    isExtended: faker.datatype.boolean(),
                },
            });
        }

        const paginationDto = {
            skip: 0,
            take: 3,
        };

        const result = await bookingService.paginationBooking(paginationDto);
        expect(result.length).toBe(3);
    });

    it('should get all bookings', async () => {
        // Seed data with Faker
        const bookings = [
            {
                bookName: faker.commerce.productName(),
                userId: 1,
                isReturned: faker.datatype.boolean(),
                isExtended: faker.datatype.boolean(),
            },
            {
                bookName: faker.commerce.productName(),
                userId: 2,
                isReturned: faker.datatype.boolean(),
                isExtended: faker.datatype.boolean(),
            },
        ];

        await prismaService.booking.createMany({
            data: bookings,
        });

        const result = await bookingService.getAllBookings();
        expect(result.length).toBe(2);
    });

    it('should search for bookings', async () => {
        // Seed data with Faker
        const keyword = faker.commerce.productName().split(' ')[0]; // Use the first word of a product name as keyword
        const bookings = [
            {
                bookName: `${keyword} Book`,
                userId: 1,
                isReturned: faker.datatype.boolean(),
                isExtended: faker.datatype.boolean(),
            },
            {
                bookName: faker.commerce.productName(),
                userId: 2,
                isReturned: faker.datatype.boolean(),
                isExtended: faker.datatype.boolean(),
            },
        ];

        await prismaService.booking.createMany({
            data: bookings,
        });

        const result = await bookingService.searchForBookings(keyword);
        expect(result.length).toBe(1);
        expect(result[0].bookName).toContain(keyword);
    });

    it('should get one booking', async () => {
        // Seed data with Faker
        const bookName = faker.commerce.productName();
        const createdBooking = await prismaService.booking.create({
            data: {
                bookName,
                userId: 1,
                isReturned: faker.datatype.boolean(),
                isExtended: faker.datatype.boolean(),
            },
        });

        const result = await bookingService.getOneBooking(createdBooking.id);
        expect(result.bookName).toBe(bookName);
    });

    it('should create a new booking', async () => {
        // Seed data with Faker
        const bookName = faker.commerce.productName();
        await prismaService.book.create({
            data: {
                name: bookName,
                description: faker.lorem.sentence(),
                image: faker.image.imageUrl(),
                createdYear: new Date(),
                pages: faker.datatype.number({ min: 50, max: 500 }),
                authorName: 'AAAA',
                isAvaible: true,
                stockNumber: faker.datatype.number({ min: 1, max: 100 }),
                serialNumber: faker.datatype.uuid(),
                categoryId: 1, // Ensure this category exists
                authorId: 1, // Ensure this author exists
                publisherId: 1, // Ensure this publisher exists
            },
        });

        // Mock these functions
        const findOneUser = await authService.findOneUserById(1); // Adjust as necessary
        const findOneBook = await bookService.findOneBookByName(bookName); // Adjust as necessary

        const bookingDto = {
            userId: findOneUser.id,
            bookName: findOneBook.name,
            isExtended: false,
            isReturned: true,
            from: formatISO(new Date()),
            to: formatISO(new Date()),
            returnedDate: formatISO(new Date()),
            extendedDate: formatISO(new Date()),
        };

        const result = await bookingService.createNewBooking(bookingDto);
        expect(result).toHaveProperty('id');
        expect(result.bookName).toBe(bookName);
    });

    it('should return a booking', async () => {
        // Seed data with Faker
        const createdBooking = await prismaService.booking.create({
            data: {
                bookName: faker.commerce.productName(),
                userId: 1,
                isReturned: false,
                isExtended: false,
            },
        });

        const returnDto = {
            id: createdBooking.id,
            isReturned: true,
            returnedDate: formatISO(new Date()),
        };

        const result = await bookingService.returnBooking(returnDto);
        expect(result.isReturned).toBe(true);
    });

    it('should extend a booking', async () => {
        // Seed data with Faker
        const createdBooking = await prismaService.booking.create({
            data: {
                bookName: faker.commerce.productName(),
                userId: 1,
                isReturned: false,
                isExtended: false,
            },
        });

        const extendDto = {
            id: createdBooking.id,
            isExtended: true,
            extendedDate: formatISO(new Date()),
        };

        const result = await bookingService.extendedBooking(extendDto);
        expect(result.isExtended).toBe(true);
    });

    afterAll(async () => {
        // Close connections, clean up
        await prismaService.$disconnect();
    });
});
