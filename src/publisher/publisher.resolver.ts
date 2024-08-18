import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PublisherService } from './publisher.service';
import { Publisher } from '@prisma/client';
import { CreatePublisherInput } from './dto/create-publisher-type';
import { UpdatePublisherInput } from './dto/update-publisher-type';

@Resolver('Publisher')
export class PublisherResolver {
  constructor(private readonly publisherService: PublisherService) {}

  @Query('publishers')
  async getPublishers(
    @Args('skip', { type: () => Number, nullable: true }) skip?: number,
    @Args('take', { type: () => Number, nullable: true }) take?: number,
  ): Promise<Publisher[]> {
    return this.publisherService.paginatePublishers(skip, take);
  }

  @Query('searchPublishers')
  async searchPublishers(
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ): Promise<Publisher[]> {
    return this.publisherService.searchPublishers(search);
  }

  @Query('publisher')
  async getPublisher(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<Publisher> {
    return this.publisherService.getPublisher(id);
  }

  @Mutation('createPublisher')
  async createPublisher(
    @Args('data') data: CreatePublisherInput,
  ): Promise<Publisher> {
    return this.publisherService.createPublisher(data);
  }

  @Mutation('updatePublisher')
  async updatePublisher(
    @Args('id', { type: () => Number }) id: number,
    @Args('data') data: UpdatePublisherInput,
  ): Promise<Publisher> {
    return this.publisherService.updatePublisher(id, data);
  }

  @Mutation('deletePublisher')
  async deletePublisher(
    @Args('id', { type: () => Number }) id: number,
  ): Promise<Publisher> {
    return this.publisherService.deletePublisher(id);
  }
}
