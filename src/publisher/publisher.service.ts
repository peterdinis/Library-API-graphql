import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { Prisma, Publisher } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Injectable()
export class PublisherService {
    constructor(private prisma: PrismaService) {}

    async deleteMany() {
        const allPublishers = await this.prisma.publisher.deleteMany();
        if (!allPublishers) {
            throw new NotFoundException('No Publishers found');
        }
        return allPublishers;
    }

    async getAllPublishers() {
        const publishers = await this.prisma.publisher.findMany({
            include: {
                books: true,
            },
        });
        if (!publishers) {
            throw new NotFoundException('No publishers found');
        }
        return publishers;
    }

    async createPublisher(
        data: Prisma.PublisherCreateInput,
    ): Promise<Publisher> {
        const newPublisher = await this.prisma.publisher.create({
            data,
        });
        if (!newPublisher) {
            throw new BadRequestException('Failed to create publisher');
        }
        pubSub.publish('publisherAdded', { publisherAdded: newPublisher }); // Publish event
        return newPublisher;
    }

    async updatePublisher(
        id: number,
        data: Prisma.PublisherUpdateInput,
    ): Promise<Publisher> {
        return this.prisma.publisher.update({
            where: { id },
            data,
        });
    }

    async deletePublisher(id: number): Promise<Publisher> {
        return this.prisma.publisher.delete({
            where: { id },
        });
    }

    async getPublisher(id: number): Promise<Publisher> {
        return this.prisma.publisher.findUnique({
            where: { id },
            include: {
                books: true,
            },
        });
    }

    async paginatePublishers(
        skip: number = 0,
        take: number = 10,
    ): Promise<Publisher[]> {
        return this.prisma.publisher.findMany({
            skip,
            take,
            include: {
                books: true,
            },
        });
    }

    async searchPublishers(search: string): Promise<Publisher[]> {
        return this.prisma.publisher.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
        });
    }
}
