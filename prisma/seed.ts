import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Create Categories
  const categoryPromises = Array.from({ length: 2 }).map(() => {
    return prisma.category.create({
      data: {
        name: faker.commerce.department(),
        description: faker.lorem.sentence(),
      },
    });
  });
  const categories = await Promise.all(categoryPromises);

  // Create Publishers
  const publisherPromises = Array.from({ length: 5 }).map(() => {
    return prisma.publisher.create({
      data: {
        name: faker.company.name(),
        description: faker.lorem.sentences(3),
        image: faker.image.business(), // URL of a random business-related image
        createdYear: faker.date.past(100), // Date within the last 100 years
        deletedYear: faker.datatype.boolean() ? faker.date.past(50) : null, // Randomly decide if a deleted year exists
      },
    });
  });
  const publishers = await Promise.all(publisherPromises);

  // Create Authors
  const authorPromises = Array.from({ length: 5 }).map(() => {
    const birthYear = faker.date.past(500);
    const deathYear = faker.datatype.boolean() ? faker.date.between(birthYear, new Date()) : null;

    return prisma.author.create({
      data: {
        name: faker.name.fullName(),
        description: faker.lorem.paragraph(),
        litPeriod: faker.date.past(200),
        birthYear,
        deathYear,
      },
    });
  });
  const authors = await Promise.all(authorPromises);

  // Create Books
  const bookPromises = Array.from({ length: 10 }).map(() => {
    return prisma.book.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.lorem.sentences(2),
        image: faker.image.abstract(), // URL of a random abstract image
        pages: faker.datatype.number({ min: 100, max: 1000 }),
        authorName: faker.name.fullName(),
        isAvaible: faker.datatype.boolean(),
        stockNumber: faker.datatype.number({ min: 1, max: 100 }),
        serialNumber: faker.datatype.uuid(),
        categoryId: 1,
        authorId: 1,
        publisherId: 1
      },
    });
  });
  const books = await Promise.all(bookPromises);

  // Create Users
  const userPromises = Array.from({ length: 5 }).map(() => {
    return prisma.user.create({
      data: {
        name: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: "ADMIN",
      },
    });
  });
  const users = await Promise.all(userPromises);

  // Create Bookings
  const bookingPromises = books.map((book) => {
    return prisma.booking.create({
      data: {
        bookName: book.name,
        from: faker.date.recent(),
        to: faker.date.future(),
        isExtended: faker.datatype.boolean(),
        isReturned: faker.datatype.boolean(),
        userId: 1
      },
    });
  });
  await Promise.all(bookingPromises);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });