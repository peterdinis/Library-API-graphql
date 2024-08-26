import { PrismaClient, Role } from '@prisma/client';
import { subYears, format, addDays } from 'date-fns';

const prisma = new PrismaClient();

async function main() {
  // Example current date
  const currentDate = format(new Date(), 'yyyy-MM-dd')

  // Create Categories
  const category1 = await prisma.category.create({
    data: {
      name: 'Fiction',
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: 'Science',
    },
  });

  // Create Authors
  const author1 = await prisma.author.create({
    data: {
      name: 'George Orwell',
      description: 'English novelist and essayist.',
      litPeriod: format(new Date('1945-01-01T00:00:00Z'), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      birthYear: format(subYears(currentDate, 121), "yyyy-MM-dd'T'HH:mm:ss'Z'"), // 121 years ago
      deathYear: format(subYears(currentDate, 73), "yyyy-MM-dd'T'HH:mm:ss'Z'"), // 73 years ago
    },
  });

  const author2 = await prisma.author.create({
    data: {
      name: 'Isaac Newton',
      description: 'English mathematician, physicist, and astronomer.',
      litPeriod: format(new Date('1687-01-01T00:00:00Z'), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      birthYear: format(subYears(currentDate, 381), "yyyy-MM-dd'T'HH:mm:ss'Z'"), // 381 years ago
      deathYear: format(subYears(currentDate, 297), "yyyy-MM-dd'T'HH:mm:ss'Z'"), // 297 years ago
    },
  });

  // Create Publishers
  const publisher1 = await prisma.publisher.create({
    data: {
      name: 'Secker & Warburg',
      description: 'British publishing house.',
      image: 'https://picsum.photos/200/300?random=1',
      createdYear: format(subYears(currentDate, 89), "yyyy-MM-dd'T'HH:mm:ss'Z'"), // 89 years ago
    },
  });

  const publisher2 = await prisma.publisher.create({
    data: {
      name: 'Royal Society',
      description: 'A fellowship of many of the world\'s most eminent scientists.',
      image: 'https://picsum.photos/200/300?random=2',
      createdYear: format(subYears(currentDate, 364), "yyyy-MM-dd'T'HH:mm:ss'Z'"), // 364 years ago
    },
  });

  // Create Books
  const book1 = await prisma.book.create({
    data: {
      name: '1984',
      description: 'A dystopian social science fiction novel.',
      image: 'https://picsum.photos/200/300?random=3',
      pages: 328,
      authorName: 'George Orwell',
      isAvaible: true,
      stockNumber: 10,
      serialNumber: '11-22-334',
      categoryId: category1.id,
      authorId: author1.id,
      publisherId: publisher1.id,
    },
  });

  const book2 = await prisma.book.create({
    data: {
      name: 'Philosophiæ Naturalis Principia Mathematica',
      description: 'A work in three books by Isaac Newton.',
      image: 'https://picsum.photos/200/300?random=4',
      pages: 512,
      authorName: 'Isaac Newton',
      isAvaible: true,
      stockNumber: 5,
      serialNumber: '11-22-335',
      categoryId: category2.id,
      authorId: author2.id,
      publisherId: publisher2.id,
    },
  });

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      name: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: Role.STUDENT,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      password: 'password123',
      role: Role.TEACHER,
    },
  });

  // Create Bookings
  await prisma.booking.create({
    data: {
      bookName: '1984',
      from: format(currentDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      to: format(addDays(currentDate, 14), "yyyy-MM-dd'T'HH:mm:ss'Z'"), // 2 weeks later
      isExtended: false,
      isReturned: false,
      userId: user1.id,
    },
  });

  await prisma.booking.create({
    data: {
      bookName: 'Philosophiæ Naturalis Principia Mathematica',
      from: format(currentDate, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      to: format(addDays(currentDate, 14), "yyyy-MM-dd'T'HH:mm:ss'Z'"), // 2 weeks later
      isExtended: false,
      isReturned: false,
      userId: user2.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });