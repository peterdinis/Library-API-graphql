import { PrismaService } from './../prisma/prisma.service';
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class BookService {
    constructor(private readonly prismaService: PrismaService) {}

    async allBooks() {
        const allBooksInApp = await this.prismaService.book.findMany();
        if(!allBooksInApp) {
            throw new NotFoundException("No books found");
        }
        return allBooksInApp
    }

    async getOneBook(id: number) {
        const oneBook = await this.prismaService.book.findFirst({
            where: {
                id
            }
        });

        if(!oneBook) {
            throw new NotFoundException("Book with this id " + id + "does not exists");
        }

        return oneBook;
    }
}