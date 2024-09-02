import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { Author } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PubSub } from 'graphql-subscriptions';
import { CreateAuthorInput } from './dto/create-author-type';
import { PaginationAuthorType } from './dto/pagination-author-type';
import { UpdateAuthorType } from './dto/update-author-type';
import { isBefore} from 'date-fns';

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
        const { birthYear, deathYear } = createAuthorInput;
    
        if (deathYear && birthYear && isBefore(deathYear, birthYear)) {
            throw new BadRequestException('Death date cannot be earlier than birth date.');
        }
    
        const newAuthor = await this.prismaService.author.create({
            data: {
                ...createAuthorInput,
            },
        });
    
        if (!newAuthor) {
            throw new BadRequestException('Failed to create author');
        }
    
        pubSub.publish('authorAdded', { authorAdded: newAuthor });
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
        // Fetch the existing author
        const oneAuthor = await this.findOne(id);
    
        // Check if the update includes both birthYear and deathYear
        const { birthYear, deathYear } = updateAuthorInput;
    
        if (deathYear && birthYear) {
            if (isBefore(deathYear, birthYear)) {
                throw new BadRequestException(
                    'Death date cannot be earlier than birth date.',
                );
            }
        }
    
        // Update the author in the database
        const updateAuthor = await this.prismaService.author.update({
            where: {
                id: oneAuthor.id,
            },
            data: updateAuthorInput,
        });
    
        // Check if the update was successful
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
