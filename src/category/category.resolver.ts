import {
    Resolver,
    Query,
    Mutation,
    Args,
    Int,
    Subscription,
} from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CategoryModel } from './category.model';
import { CreateCategoryInput } from './dto/create-category-type';
import { UpdateCategoryInput } from './dto/update-category-type';
import { PaginationCategoryType } from './dto/pagination-category-types';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => CategoryModel)
export class CategoryResolver {
    constructor(private readonly categoryService: CategoryService) {}

    @Query(() => [CategoryModel])
    async findAllCategories() {
        return this.categoryService.findAllCategories();
    }

    @Query(() => CategoryModel)
    async findOneCategory(@Args('id', { type: () => Int }) id: number) {
        return this.categoryService.findOne(id);
    }

    @Mutation(() => CategoryModel)
    async createCategory(
        @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
    ) {
        return this.categoryService.create(createCategoryInput);
    }

    @Mutation(() => CategoryModel)
    async updateCategory(
        @Args('id', { type: () => Int }) id: number,
        @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
    ) {
        return this.categoryService.update(id, updateCategoryInput);
    }

    @Mutation(() => CategoryModel)
    async removeCategory(@Args('id', { type: () => Int }) id: number) {
        return this.categoryService.remove(id);
    }

    @Query(() => [CategoryModel])
    async paginationCategories(
        @Args('paginationDto') paginationDto: PaginationCategoryType,
    ) {
        return this.categoryService.paginationCategories(paginationDto);
    }

    @Query(() => [CategoryModel])
    async searchCategories(@Args('keyword') keyword: string) {
        return this.categoryService.searchCategories(keyword);
    }

    @Subscription(() => CategoryModel, {
        resolve: (payload) => payload.categoryAdded,
    })
    categoryAdded() {
        return pubSub.asyncIterator('categoryAdded');
    }
}
