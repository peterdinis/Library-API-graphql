import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthorsService } from 'src/authors/authors.service';
import { BookService } from 'src/book/book.service';
import { CategoryService } from 'src/category/category.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PublisherService } from 'src/publisher/publisher.service';

@Injectable()
export class AdminService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly bookService: BookService,
        private readonly publisherService: PublisherService,
        private readonly authorService: AuthorsService,
        private readonly categoryService: CategoryService
    ) {}

    async adminBooks() {
        return this.bookService.allBooks();
    }

    async adminCategories() {
        return this.categoryService.findAllCategories();
    }

    async adminAuthors() {
        return this.authorService.findAllAuthors();
    }
    
    async adminPublishers() {
        return this.publisherService.allPublishers();
    }
}
