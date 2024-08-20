import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { formatISO, parseISO } from 'date-fns';
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
    // Seed data
    for (let i = 0; i < 5; i++) {
      await prismaService.booking.create({
        data: {
          bookName: `Book ${i}`,
          userId: i + 1,
          isReturned: false,
          isExtended: false,
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
    // Seed data
    await prismaService.booking.createMany({
      data: [
        { bookName: 'Book 1', userId: 1, isReturned: false, isExtended: false },
        { bookName: 'Book 2', userId: 2, isReturned: false, isExtended: false },
      ],
    });

    const result = await bookingService.getAllBookings();
    expect(result.length).toBe(2);
  });

  it('should search for bookings', async () => {
    // Seed data
    await prismaService.booking.createMany({
      data: [
        { bookName: 'Special Book', userId: 1, isReturned: false, isExtended: false },
        { bookName: 'Regular Book', userId: 2, isReturned: false, isExtended: false },
      ],
    });

    const keyword = 'Special';
    const result = await bookingService.searchForBookings(keyword);
    expect(result.length).toBe(1);
    expect(result[0].bookName).toBe('Special Book');
  });

  it('should get one booking', async () => {
    // Seed data
    const createdBooking = await prismaService.booking.create({
      data: {
        bookName: 'Unique Book',
        userId: 1,
        isReturned: false,
        isExtended: false,
      },
    });

    const result = await bookingService.getOneBooking(createdBooking.id);
    expect(result.bookName).toBe('Unique Book');
  });

  it('should create a new booking', async () => {
    // Seed data
    await prismaService.book.create({
      data: {
        name: 'Test Book',
        author: 'Test Author',
      },
    });

    const findOneUser = await authService.findOneUserById(1); // Mock this
    const findOneBook = await bookService.findOneBookByName('Test Book'); // Mock this

    const bookingDto = {
      userId: findOneUser.id,
      bookName: findOneBook.name,
    };

    const result = await bookingService.createNewBooking(bookingDto);
    expect(result).toHaveProperty('id');
    expect(result.bookName).toBe('Test Book');
  });

  it('should return a booking', async () => {
    // Seed data
    const createdBooking = await prismaService.booking.create({
      data: {
        bookName: 'Test Book',
        userId: 1,
        isReturned: false,
        isExtended: false,
      },
    });

    const returnDto = {
      id: createdBooking.id,
      isReturned: true,
      returnedDAte: formatISO(new Date()),
    };

    const result = await bookingService.returnBooking(returnDto);
    expect(result.isReturned).toBe(true);
  });

  it('should extend a booking', async () => {
    // Seed data
    const createdBooking = await prismaService.booking.create({
      data: {
        bookName: 'Test Book',
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