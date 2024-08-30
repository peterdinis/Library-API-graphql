import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { parseISO } from 'date-fns';

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
                description: faker.lorem.paragraphs(3),
                image: faker.image.url(),
                createdYear: parseISO(
                    faker.date.past({ years: 100 }).toISOString(),
                ), // Date within the last 100 years
                deletedYear: faker.datatype.boolean()
                    ? parseISO(faker.date.past({ years: 50 }).toISOString())
                    : null, // Randomly decide if a deleted year exists
            },
        });
    });
    const publishers = await Promise.all(publisherPromises);

    // Create Authors
    const authorPromises = Array.from({ length: 5 }).map(() => {
        const birthYear = parseISO(
            faker.date.past({ years: 500 }).toISOString(),
        );
        const deathYear = faker.datatype.boolean()
            ? parseISO(
                  faker.date
                      .between({ from: birthYear, to: new Date() })
                      .toISOString(),
              )
            : null;

        return prisma.author.create({
            data: {
                name: faker.person.fullName(),
                description: faker.lorem.paragraph(),
                litPeriod: parseISO(
                    faker.date.past({ years: 200 }).toISOString(),
                ),
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
                image: faker.image.url(),
                pages: faker.number.int({ min: 100, max: 1000 }),
                authorName: faker.person.fullName(),
                isAvaiable: faker.datatype.boolean(),
                stockNumber: faker.number.int({ min: 1, max: 100 }),
                serialNumber: faker.string.uuid(),
                categoryId: 1,
                authorId: 1,
                publisherId: 1,
            },
        });
    });
    const books = await Promise.all(bookPromises);

    // Create Users
    const userPromises = Array.from({ length: 5 }).map(() => {
        return prisma.user.create({
            data: {
                name: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
                role: 'ADMIN',
            },
        });
    });
    const users = await Promise.all(userPromises);

    // Create Bookings
    const bookingPromises = books.map((book) => {
        return prisma.booking.create({
            data: {
                bookName: book.name,
                from: parseISO(faker.date.recent().toISOString()),
                to: parseISO(faker.date.future().toISOString()),
                isExtended: faker.datatype.boolean(),
                isReturned: faker.datatype.boolean(),
                userId: 1,
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
