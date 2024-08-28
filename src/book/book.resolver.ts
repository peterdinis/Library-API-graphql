import {
    Resolver,
    Query,
    Mutation,
    Args,
    Int,
    Subscription,
} from '@nestjs/graphql';
import { BookService } from './book.service';
import { BookModel } from './book.model';
import { CreateBookInput } from './dto/create-book-type';
import { UpdateBookInput } from './dto/update-book-type';
import { PaginationBookType } from './dto/pagination-book-type';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => BookModel)
export class BookResolver {
    constructor(private readonly bookService: BookService) {}

    @Query(() => [BookModel])
    async getAllBooks() {
        return this.bookService.allBooks();
    }

    @Query(() => BookModel)
    async getOneBook(@Args('id', { type: () => Int }) id: number) {
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
        @Args('id', { type: () => Int }) id: number,
        @Args('updateBookInput') updateBookInput: UpdateBookInput,
    ) {
        return this.bookService.updateBook(id, updateBookInput);
    }

    @Mutation(() => BookModel)
    async deleteBook(@Args('id', { type: () => Int }) id: number) {
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

    @Subscription(() => BookModel, {
        resolve: (payload) => payload.bookAdded,
    })
    bookAdded() {
        return pubSub.asyncIterator('bookAdded');
    }
}
