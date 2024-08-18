import { Injectable } from '@nestjs/common';
import { Prisma, Publisher } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PublisherService {
  constructor(private prisma: PrismaService) {}

  async createPublisher(data: Prisma.PublisherCreateInput): Promise<Publisher> {
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
    });
  }

  async getPublishers(
    skip: number = 0,
    take: number = 10,
    search: string = '',
  ): Promise<Publisher[]> {
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
      skip,
      take,
    });
  }
}
