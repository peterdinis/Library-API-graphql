import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { Prisma, Author } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PubSub } from 'graphql-subscriptions';
import { CreateAuthorInput } from './dto/create-author-type';
import { PaginationAuthorType } from './dto/pagination-author-type';
import { UpdateAuthorType } from './dto/update-author-type';

const pubSub = new PubSub();

@Injectable()
export class AuthorsService {
    constructor(private readonly prismaService: PrismaService) {}

    async deleteMany() {
        const allAuthors = await this.prismaService.author.deleteMany();
        if (!allAuthors) {
            throw new NotFoundException('No Authors Found');
        }
        return allAuthors;
    }

    async create(createAuthorInput: CreateAuthorInput): Promise<Author> {
        const newAuthor = await this.prismaService.author.create({
            data: {
                ...createAuthorInput,
            },
        });

        if (!newAuthor) {
            throw new BadRequestException('Failed to create author');
        }
        pubSub.publish('authorAdded', { authorAdded: newAuthor }); // Publish event
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
                books: true,
            },
        });

        if (!findOneAuthor) {
            throw new NotFoundException('No author found');
        }

        return findOneAuthor;
    }

    async update(
        id: number,
        updateAuthorInput: UpdateAuthorType,
    ): Promise<Author> {
        const oneAuthor = await this.findOne(id);

        const updateAuthor = await this.prismaService.author.update({
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

    async remove(id: number): Promise<Author> {
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
                `No authors found for keyword "${keyword}"`,
            );
        }

        return foundAuthors;
    }

    async paginationAuthors(paginationDto: PaginationAuthorType) {
        const allAuthors = await this.prismaService.author.findMany({
            skip: paginationDto.skip,
            take: paginationDto.take,
            include: {
                books: true,
            },
        });

        if (!allAuthors || allAuthors.length === 0) {
            throw new NotFoundException('No authors found');
        }

        return allAuthors;
    }
}
