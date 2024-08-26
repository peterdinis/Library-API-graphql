import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ApolloServerTestingModule, ApolloServerTestingClient } from 'apollo-server-testing';
import { GraphQLModule } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { BookingResolver } from './booking.resolver';
import { BookingService } from './booking.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingType } from './dto/create-booking-dto';
import { ReturnBookingType } from './dto/return-booking-dto';
import { ExtendedBookingType } from './dto/extended-booking-dto';
import { PaginationBookingType } from './dto/pagination-booking-dto';
import { BookingModel } from './booking.model';
import { faker } from '@faker-js/faker'; // Import Faker.js

describe('BookingResolver (e2e)', () => {
  let app: INestApplication;
  let client: ApolloServerTestingClient;
  let pubSub: PubSub;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot({
          autoSchemaFile: true,
          subscriptions: { 'graphql-ws': true },
        }),
        ApolloServerTestingModule,
      ],
      providers: [BookingResolver, BookingService, PrismaService, {
        provide: 'PUB_SUB',
        useValue: new PubSub(),
      }],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    client = moduleFixture.get<ApolloServerTestingClient>(ApolloServerTestingClient);
    pubSub = moduleFixture.get<PubSub>('PUB_SUB');
  });

  it('should return all bookings', async () => {
    // Seed data with Faker
    const bookName = faker.commerce.productName();
    await client.mutate({
      mutation: `
        mutation {
          createNewBooking(bookingDto: { bookName: "${bookName}", userId: 1 }) {
            id
            bookName
          }
        }
      `,
    });

    const result = await client.query({ query: `query { getAllBookings { id bookName } }` });
    expect(result.data.getAllBookings).toHaveLength(1);
    expect(result.data.getAllBookings[0].bookName).toBe(bookName);
  });

  it('should create a new booking', async () => {
    const bookName = faker.commerce.productName();
    const variables = {
      bookingDto: {
        bookName: bookName,
        userId: faker.datatype.number({ min: 1, max: 100 }),
      },
    };

    const result = await client.mutate({
      mutation: `
        mutation($bookingDto: CreateBookingInput!) {
          createNewBooking(bookingDto: $bookingDto) {
            id
            bookName
          }
        }
      `,
      variables,
    });
    expect(result.data.createNewBooking.bookName).toBe(bookName);
  });

  it('should return a booking', async () => {
    // Seed a booking
    const bookName = faker.commerce.productName();
    const createBookingResult = await client.mutate({
      mutation: `
        mutation {
          createNewBooking(bookingDto: { bookName: "${bookName}", userId: 2 }) {
            id
            bookName
          }
        }
      `,
    });

    const bookingId = createBookingResult.data.createNewBooking.id;

    const RETURN_BOOKING_MUTATION = `
      mutation($returnDto: ReturnBookingInput!) {
        returnBooking(returnDto: $returnDto) {
          id
          isReturned
        }
      }
    `;

    const variables = {
      returnDto: {
        id: bookingId,
        isReturned: true,
        returnedDate: faker.date.recent().toISOString(),
      },
    };

    const result = await client.mutate({ mutation: RETURN_BOOKING_MUTATION, variables });
    expect(result.data.returnBooking.isReturned).toBe(true);
  });

  it('should extend a booking', async () => {
    // Seed a booking
    const bookName = faker.commerce.productName();
    const createBookingResult = await client.mutate({
      mutation: `
        mutation {
          createNewBooking(bookingDto: { bookName: "${bookName}", userId: 3 }) {
            id
            bookName
          }
        }
      `,
    });

    const bookingId = createBookingResult.data.createNewBooking.id;

    const EXTEND_BOOKING_MUTATION = `
      mutation($extendDto: ExtendedBookingInput!) {
        extendedBooking(extendDto: $extendDto) {
          id
          isExtended
          extendedDate
        }
      }
    `;

    const variables = {
      extendDto: {
        id: bookingId,
        isExtended: true,
        extendedDate: faker.date.future().toISOString(),
      },
    };

    const result = await client.mutate({ mutation: EXTEND_BOOKING_MUTATION, variables });
    expect(result.data.extendedBooking.isExtended).toBe(true);
  });

  it('should support bookingCreated subscription', done => {
    const bookName = faker.commerce.productName();

    const CREATE_BOOKING_MUTATION = `
      mutation {
        createNewBooking(bookingDto: { bookName: "${bookName}", userId: 4 }) {
          id
          bookName
        }
      }
    `;

    client.subscribe({
      query: `subscription { bookingCreated { id bookName message } }`,
    }).subscribe({
      next(data) {
        expect(data.bookingCreated.bookName).toBe(bookName);
        done();
      },
      error(err) {
        done.fail(err);
      },
    });

    client.mutate({ mutation: CREATE_BOOKING_MUTATION });
  });

  afterAll(async () => {
    await app.close();
  });
});