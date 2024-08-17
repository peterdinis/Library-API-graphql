import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CategoryService } from './category.service';
import { CreateCategoryInput } from './dto/create-category-type';
import { UpdateCategoryInput } from './dto/update-category-type';
import { CategoryModel } from './category.model';
import { PaginationCategoryType } from './dto/pagination-category-types';

@Resolver(() => CategoryModel)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Mutation(() => CategoryModel)
  async createCategory(
    @Args('createCategoryInput') createCategoryInput: CreateCategoryInput,
  ) {
    return this.categoryService.create(createCategoryInput);
  }

  @Query(() => [CategoryModel], { name: 'categories' })
  async findAllCategories() {
    return this.categoryService.findAllCategories();
  }

  @Query(() => CategoryModel, { name: 'category' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return this.categoryService.findOne(id);
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
  
  @Query(() => [CategoryModel], { name: 'searchCategories' })
  async searchCategories(
    @Args('keyword', { type: () => String }) keyword: string,
  ) {
    return this.categoryService.searchCategories(keyword);
  }

  @Query(() => [CategoryModel], { name: 'paginationCategories' })
  async paginationCategories(
    @Args('paginationDto') paginationDto: PaginationCategoryType,
  ) {
    return this.categoryService.paginationCategories(paginationDto);
  }
}
