import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    return this.prismaService.category.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateCategoryInput: UpdateCategoryInput) {
    return this.prismaService.category.update({
      where: { id },
      data: updateCategoryInput,
    });
  }

  async remove(id: number) {
    return this.prismaService.category.delete({
      where: { id },
    });
  }
}
