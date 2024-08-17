import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAuthorInput } from './dto/create-author-type';
import { UpdateAuthorType } from './dto/update-author-type';
import { PaginationAuthorType } from './dto/pagination-author-type';

@Injectable()
export class AuthorsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAuhtorInput: CreateAuthorInput) {
    const newAuthor = await this.prismaService.author.create({
      data: {
        ...createAuhtorInput,
      },
    });

    if (!newAuthor) {
      throw new BadRequestException('Failed to create author');
    }

    return newAuthor;
  }

  async findAllAuthors() {
    const allAuthors = await this.prismaService.author.findMany({
      include: {
        books: true,
      },
    });
    if (!allAuthors) {
      throw new NotFoundException('No authors found');
    }

    return allAuthors;
  }

  async findOne(id: number) {
    const findOneAuthor = await this.prismaService.author.findFirst({
      where: {
        id,
      },
      include: {
        books: true
      }
    });

    if (!findOneAuthor) {
      throw new NotFoundException('No author found');
    }

    return findOneAuthor;
  }

  async update(id: number, updateAuthorInput: UpdateAuthorType) {
    const oneAuthor = await this.findOne(id);

    const updateAuthor = await this.prismaService.category.update({
      where: {
        id: oneAuthor.id,
      },

      data: updateAuthorInput,
    });

    if (!updateAuthor) {
      throw new ForbiddenException('Failed to update author');
    }

    return updateAuthor;
  }

  async remove(id: number) {
    const oneAuthor = await this.findOne(id);
    return this.prismaService.author.delete({
      where: { id: oneAuthor.id },
    });
  }

  async searchAuthors(keyword: string) {
    const foundAuthors = await this.prismaService.author.findMany({
      where: {
        OR: [{ name: { contains: keyword, mode: 'insensitive' } }],
      },
    });

    if (!foundAuthors || foundAuthors.length === 0) {
      throw new NotFoundException(
        `No categories found for keyword "${keyword}"`,
      );
    }

    return foundAuthors;
  }

  async paginationCategories(paginationDto: PaginationAuthorType) {
    const allCategoriesInApp = await this.prismaService.category.findMany({
      skip: paginationDto.skip,
      take: paginationDto.take,
    });

    if (!allCategoriesInApp || allCategoriesInApp.length === 0) {
      throw new NotFoundException('No categories found');
    }

    return allCategoriesInApp;
  }
}
