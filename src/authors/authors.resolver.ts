import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthorsService } from './authors.service';
import { AuthorModel } from './authors.model';
import { CreateAuthorInput } from './dto/create-author-type';
import { PaginationAuthorType } from './dto/pagination-author-type';
import { UpdateAuthorType } from './dto/update-author-type';

@Resolver(() => AuthorModel)
export class AuthorsResolver {
    constructor(private readonly authorsService: AuthorsService) {}

    @Query(() => [AuthorModel], { name: 'authors' })
    async findAllAuthors() {
        return this.authorsService.findAllAuthors();
    }

    @Query(() => AuthorModel, { name: 'author' })
    async findOne(@Args('id', { type: () => Int }) id: number) {
        return this.authorsService.findOne(id);
    }

    @Mutation(() => AuthorModel)
    async createAuthor(
        @Args('createAuthorInput') createAuthorInput: CreateAuthorInput,
    ) {
        return this.authorsService.create(createAuthorInput);
    }

    @Mutation(() => AuthorModel)
    async updateAuthor(
        @Args('id', { type: () => Int }) id: number,
        @Args('updateAuthorInput') updateAuthorInput: UpdateAuthorType,
    ) {
        return this.authorsService.update(id, updateAuthorInput);
    }

    @Mutation(() => Boolean)
    async removeAuthor(@Args('id', { type: () => Int }) id: number) {
        await this.authorsService.remove(id);
        return true;
    }

    @Query(() => [AuthorModel], { name: 'searchAuthors' })
    async searchAuthors(
        @Args('keyword', { type: () => String }) keyword: string,
    ) {
        return this.authorsService.searchAuthors(keyword);
    }

    @Query(() => [AuthorModel], { name: 'paginationAuthors' })
    async paginationAuthors(
        @Args('paginationDto') paginationDto: PaginationAuthorType,
    ) {
        return this.authorsService.paginationCategories(paginationDto);
    }
}
