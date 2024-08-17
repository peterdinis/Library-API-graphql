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

@Injectable()
export class BookService {
  constructor(private readonly prismaService: PrismaService) {}

  async allBooks() {
    const allBooksInApp = await this.prismaService.book.findMany();
    if (!allBooksInApp) {
      throw new NotFoundException('No books found');
    }
    return allBooksInApp;
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
    const newBook = await this.prismaService.book.create({
      data: {
        ...newBookDto,
      },
    });

    if (!newBook) {
      throw new BadRequestException('Could not create book');
    }

    return newBook;
  }

  async updateBook(id: number, updateBookDto: UpdateBookInput) {
    const findOneBook = await this.getOneBook(id);

    const updateOneBook = await this.prismaService.book.update({
      where: {
        id: findOneBook.id,
      },

      data: {
        ...updateBookDto,
      },
    });

    if (!updateBookDto) {
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
      throw new NotFoundException(`No books found for keyword "${keyword}"`);
    }

    return foundBooks;
  }

  async paginationBooks(paginationDto: PaginationBookType) {
    const allBooksInApp = await this.prismaService.book.findMany({
      skip: paginationDto.skip,
      take: paginationDto.take,
    });

    if (!allBooksInApp || allBooksInApp.length === 0) {
      throw new NotFoundException('No books found');
    }

    return allBooksInApp;
  }
}
