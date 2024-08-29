import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PubSub } from 'graphql-subscriptions';
import { CreateCategoryInput } from './dto/create-category-type';
import { UpdateCategoryInput } from './dto/update-category-type';
import { PaginationCategoryType } from './dto/pagination-category-types';

const pubSub = new PubSub();

@Injectable()
export class CategoryService {
    constructor(private readonly prismaService: PrismaService) {}

    async deleteMany() {
        const allCategories = await this.prismaService.category.deleteMany();
        if (!allCategories) {
            throw new NotFoundException('No Categories found');
        }
        return allCategories;
    }

    async create(createCategoryInput: CreateCategoryInput) {
        const newCategory = await this.prismaService.category.create({
            data: {
                ...createCategoryInput,
            },
        });

        if (!newCategory) {
            throw new BadRequestException('Failed to create category');
        }

        pubSub.publish('categoryAdded', { categoryAdded: newCategory }); // Publish the event

        return newCategory;
    }

    async findAllCategories() {
        const allCategories = await this.prismaService.category.findMany({
            include: {
                books: true,
            },
        });
        if (!allCategories) {
            throw new NotFoundException('No categories found');
        }

        return allCategories;
    }

    async findOne(id: number) {
        const findOneCategory = await this.prismaService.category.findFirst({
            where: {
                id,
            },
            include: {
                books: true,
            },
        });

        if (!findOneCategory) {
            throw new NotFoundException('No category found');
        }

        return findOneCategory;
    }

    async update(id: number, updateCategoryInput: UpdateCategoryInput) {
        const oneCategory = await this.findOne(id);

        const updateCategory = await this.prismaService.category.update({
            where: {
                id: oneCategory.id,
            },

            data: updateCategoryInput,
        });

        if (!updateCategory) {
            throw new ForbiddenException('Failed to update category');
        }

        return updateCategory;
    }

    async remove(id: number) {
        const oneCategory = await this.findOne(id);
        return this.prismaService.category.delete({
            where: { id: oneCategory.id },
        });
    }

    async searchCategories(keyword: string) {
        const foundCategories = await this.prismaService.category.findMany({
            where: {
                OR: [{ name: { contains: keyword, mode: 'insensitive' } }],
            },
        });

        if (!foundCategories || foundCategories.length === 0) {
            throw new NotFoundException(
                `No categories found for keyword "${keyword}"`,
            );
        }

        return foundCategories;
    }

    async paginationCategories(paginationDto: PaginationCategoryType) {
        const allCategoriesInApp = await this.prismaService.category.findMany({
            skip: paginationDto.skip,
            take: paginationDto.take,
            include: {
                books: true
            }
        });

        if (!allCategoriesInApp || allCategoriesInApp.length === 0) {
            throw new NotFoundException('No categories found');
        }

        return allCategoriesInApp;
    }
}
