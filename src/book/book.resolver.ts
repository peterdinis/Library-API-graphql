import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BookService } from './book.service';
import { BookModel } from './book.model';

@Resolver(() => BookModel) 
export class BookResolver {
    constructor(private readonly bookService: BookService) {}

    @Query(() => BookModel)
    async getAllBooks() {
        return this.bookService.allBooks();
    }

    @Query(() => BookModel)
    async getOneBook(@Args("id") id: number) {
        return this.bookService.getOneBook(id);
    }
}