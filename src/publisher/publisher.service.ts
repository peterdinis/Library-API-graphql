import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Publisher } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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

    async allPublishers() {
        const publishers = await this.prisma.publisher.findMany();
        if (!publishers) {
            throw new NotFoundException('No publishers found');
        }

        return publishers;
    }

    async createPublisher(
        data: Prisma.PublisherCreateInput,
    ): Promise<Publisher> {
        return this.prisma.publisher.create({
            data,
        });
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
            }
        });
    }

    // Method for pagination
    async paginatePublishers(
        skip: number = 0,
        take: number = 10,
    ): Promise<Publisher[]> {
        return this.prisma.publisher.findMany({
            skip,
            take,
        });
    }

    // Method for search
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
