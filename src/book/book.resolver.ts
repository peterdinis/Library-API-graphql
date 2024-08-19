import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BookService } from './book.service';
import { BookModel } from './book.model';
import { CreateBookInput } from './dto/create-book-type';
import { UpdateBookInput } from './dto/update-book-type';
import { PaginationBookType } from './dto/pagination-book-type';

@Resolver(() => BookModel)
export class BookResolver {
    constructor(private readonly bookService: BookService) {}

    @Query(() => [BookModel])
    async getAllBooks() {
        return this.bookService.allBooks();
    }

    @Query(() => BookModel)
    async getOneBook(@Args('id') id: number) {
        return this.bookService.getOneBook(id);
    }

    @Mutation(() => BookModel)
    async createBook(
        @Args('createBookInput') createBookInput: CreateBookInput,
    ) {
        return this.bookService.createBook(createBookInput);
    }

    @Mutation(() => BookModel)
    async updateBook(
        @Args('id') id: number,
        @Args('updateBookInput') updateBookInput: UpdateBookInput,
    ) {
        return this.bookService.updateBook(id, updateBookInput);
    }

    @Mutation(() => BookModel)
    async deleteBook(@Args('id') id: number) {
        return this.bookService.deleteBook(id);
    }

    @Query(() => [BookModel])
    async getPaginationBooks(
        @Args('paginationDto') paginationDto: PaginationBookType,
    ) {
        return this.bookService.paginationBooks(paginationDto);
    }

    @Query(() => [BookModel])
    async searchBooks(@Args('keyword') keyword: string) {
        return this.bookService.searchBooks(keyword);
    }
}
