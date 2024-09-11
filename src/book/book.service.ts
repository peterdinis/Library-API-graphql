import { PrismaService } from './../prisma/prisma.service';
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateBookInput } from './dto/create-book-type';
import { UpdateBookInput } from './dto/update-book-type';
import { PaginationBookType } from './dto/pagination-book-type';
import { PubSub } from 'graphql-subscriptions';
import { parse, isValid, format } from 'date-fns';

const pubSub = new PubSub();

@Injectable()
export class BookService {
    constructor(private readonly prismaService: PrismaService) {}

    async allBooks() {
        const allBooksInApp = await this.prismaService.book.findMany({
            include: {
                category: true,
                publisher: true,
                author: true,
            },
        });
        if (!allBooksInApp) {
            throw new NotFoundException('No books found');
        }
        return allBooksInApp;
    }

    async findOneBookByName(name: string) {
        const oneBook = await this.prismaService.book.findFirst({
            where: {
                name,
            },
            include: {
                category: true,
                publisher: true,
                author: true,
            },
        });

        if (!oneBook) {
            throw new NotFoundException(
                'Book with this name ' + name + 'does not exists',
            );
        }

        return oneBook;
    }

    async getOneBook(id: number) {
        const oneBook = await this.prismaService.book.findFirst({
            where: {
                id,
            },
        });

        if (!oneBook) {
            throw new NotFoundException(
                'Book with this id ' + id + 'does not exists',
            );
        }

        return oneBook;
    }

    async createBook(newBookDto: CreateBookInput) {
        // Check if the category exists
        const findCategoryForBook =
            await this.prismaService.category.findUnique({
                where: {
                    id: newBookDto.categoryId,
                },
            });

        // If the category doesn't exist, throw an error
        if (!findCategoryForBook) {
            throw new NotFoundException(
                `Category with ID ${newBookDto.categoryId} not found`,
            );
        }

        // Check if the author exists
        const findAuthorForBook = await this.prismaService.author.findUnique({
            where: {
                id: newBookDto.authorId,
            },
        });

        if (!findAuthorForBook) {
            throw new NotFoundException(
                `Author with ID ${newBookDto.authorId} not found`,
            );
        }

        // Check if the publisher exists
        const findPublisherForBook =
            await this.prismaService.publisher.findUnique({
                where: {
                    id: newBookDto.publisherId,
                },
            });

        if (!findPublisherForBook) {
            throw new NotFoundException(
                `Publisher with ID ${newBookDto.publisherId} not found`,
            );
        }

        // Validate the createdYear format
        const parsedDate = parse(
            String(newBookDto.createdYear),
            'yyyy-MM-dd',
            new Date(),
        );

        if (!isValid(parsedDate)) {
            throw new BadRequestException(
                `Invalid date format for createdYear. Expected format is yyyy-MM-dd.`,
            );
        }

        // Create the book
        const newBook = await this.prismaService.book.create({
            data: {
                ...newBookDto,
                createdYear: format(parsedDate, 'yyyy-MM-dd'), // Ensure it's stored correctly formatted
            },
        });

        // If the book creation fails for some reason, throw an error
        if (!newBook) {
            throw new BadRequestException('Could not create book');
        }

        pubSub.publish('bookAdded', { bookAdded: newBook });

        return newBook;
    }

    async updateBook(id: number, updateBookDto: UpdateBookInput) {
        // Fetch the existing book
        const findOneBook = await this.getOneBook(id);

        // If the update includes a new date, validate the format
        if (updateBookDto.createdYear) {
            const parsedDate = parse(
                updateBookDto.createdYear,
                'yyyy-MM-dd',
                new Date(),
            );

            if (!isValid(parsedDate)) {
                throw new BadRequestException(
                    `Invalid date format for createdYear. Expected format is yyyy-MM-dd.`,
                );
            }

            // Ensure the date is correctly formatted before updating
            updateBookDto.createdYear = format(parsedDate, 'yyyy-MM-dd');
        }

        // Update the book in the database
        const updateOneBook = await this.prismaService.book.update({
            where: {
                id: findOneBook.id,
            },
            data: {
                ...updateBookDto,
            },
        });

        // Check if the update was successful
        if (!updateOneBook) {
            throw new ForbiddenException('Failed to update book');
        }

        return updateOneBook;
    }

    async deleteBook(id: number) {
        const findOneBook = await this.getOneBook(id);

        const deleteOneBook = await this.prismaService.book.delete({
            where: { id: findOneBook.id },
        });

        if (!deleteOneBook) {
            throw new ForbiddenException('Failed to delete book');
        }

        return deleteOneBook;
    }

    async searchBooks(keyword: string) {
        const foundBooks = await this.prismaService.book.findMany({
            where: {
                OR: [{ name: { contains: keyword, mode: 'insensitive' } }],
            },
        });

        if (!foundBooks || foundBooks.length === 0) {
            throw new NotFoundException(
                `No books found for keyword "${keyword}"`,
            );
        }

        return foundBooks;
    }

    async paginationBooks(paginationDto: PaginationBookType) {
        const allBooksInApp = await this.prismaService.book.findMany({
            skip: paginationDto.skip,
            take: paginationDto.take,
            include: {
                category: true,
                publisher: true,
                author: true,
            },
        });

        if (!allBooksInApp || allBooksInApp.length === 0) {
            throw new NotFoundException('No books found');
        }

        return allBooksInApp;
    }
}
