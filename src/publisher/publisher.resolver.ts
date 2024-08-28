import {
    Resolver,
    Query,
    Mutation,
    Args,
    Subscription,
    Int,
} from '@nestjs/graphql';
import { PublisherService } from './publisher.service';
import { CreatePublisherInput } from './dto/create-publisher-type';
import { UpdatePublisherInput } from './dto/update-publisher-type';
import { PublisherModel } from './publisher.model';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver(() => PublisherModel)
export class PublisherResolver {
    constructor(private readonly publisherService: PublisherService) {}

    @Query(() => [PublisherModel])
    async paginatedPublishers(
        @Args('skip', { type: () => Int, nullable: true }) skip?: number,
        @Args('take', { type: () => Int, nullable: true }) take?: number,
    ) {
        return this.publisherService.paginatePublishers(skip, take);
    }

    @Query(() => [PublisherModel])
    async allPublishers() {
        return this.publisherService.getAllPublishers();
    }

    @Query(() => [PublisherModel])
    async searchPublishers(
        @Args('search', { type: () => String, nullable: true }) search?: string,
    ) {
        return this.publisherService.searchPublishers(search);
    }

    @Query(() => PublisherModel)
    async getPublisher(@Args('id', { type: () => Int }) id: number) {
        return this.publisherService.getPublisher(id);
    }

    @Mutation(() => PublisherModel)
    async createPublisher(@Args('data') data: CreatePublisherInput) {
        return this.publisherService.createPublisher(data);
    }

    @Mutation(() => PublisherModel)
    async updatePublisher(
        @Args('id', { type: () => Int }) id: number,
        @Args('data') data: UpdatePublisherInput,
    ) {
        return this.publisherService.updatePublisher(id, data);
    }

    @Mutation(() => PublisherModel)
    async deletePublisher(@Args('id', { type: () => Int }) id: number) {
        return this.publisherService.deletePublisher(id);
    }

    @Subscription(() => PublisherModel, {
        resolve: (payload) => payload.publisherAdded,
    })
    publisherAdded() {
        return pubSub.asyncIterator('publisherAdded');
    }
}
