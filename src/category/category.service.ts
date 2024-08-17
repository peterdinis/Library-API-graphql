import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryInput } from './dto/create-category-type';
import { UpdateCategoryInput } from './dto/update-category-type';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCategoryInput: CreateCategoryInput) {
    const newCategory = await this.prismaService.category.create({
        data: {
            ...createCategoryInput
        }
    });

    if(!newCategory) {
        throw new BadRequestException("Failed to create category");
    }

    return newCategory;
  }

  async findAllCategories() {
    const allCategories = await this.prismaService.category.findMany({});
    if(!allCategories) {
        throw new NotFoundException("No categories found");
    }

    return allCategories;
  }

  async findOne(id: number) {
    const findOneCategory = await this.prismaService.category.findFirst({
        where: {
            id
        }
    });

    if(!findOneCategory) {
        throw new NotFoundException("No category found");
    }

    return findOneCategory;
  }

  async update(id: number, updateCategoryInput: UpdateCategoryInput) {
    const oneCategory = await this.findOne(id);

    const updateCategory = await this.prismaService.category.update({
        where: {
            id: oneCategory.id
        },

        data: updateCategoryInput
    });

    if(!updateCategory) {
        throw new ForbiddenException("Failed to update category");
    }

    return updateCategory;
  }

  async remove(id: number) {
    const oneCategory = await this.findOne(id);
    return this.prismaService.category.delete({
      where: { id: oneCategory.id },
    });
  }
}
