import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { BookingService } from './booking.service';
import { CreateBookingType } from './dto/create-booking-dto';
import { ReturnBookingType } from './dto/return-booking-dto';
import { ExtendedBookingType } from './dto/extended-booking-dto';
import { PaginationBookingType } from './dto/pagination-booking-dto';
import { BookingModel } from './booking.model';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => BookingModel)
export class BookingResolver {
    constructor(
        private readonly bookingService: BookingService,
        @Inject("PUB_SUB") private readonly pubSub: PubSub
    ) {}

    @Query(() => [BookingModel])
    async getAllBookings() {
        return this.bookingService.getAllBookings();
    }

    @Query(() => BookingModel)
    async getOneBooking(@Args('id', { type: () => Int }) id: number) {
        return this.bookingService.getOneBooking(id);
    }

    @Mutation(() => BookingModel)
    async createNewBooking(@Args('bookingDto') bookingDto: CreateBookingType) {
        return this.bookingService.createNewBooking(bookingDto);
    }

    @Subscription(() => BookingModel, {
        resolve: (value) => value.bookingCreated,
    })
    bookingCreated() {
        return this.pubSub.asyncIterator('bookingCreated');
    }

    @Mutation(() => BookingModel)
    async returnBooking(@Args('returnDto') returnDto: ReturnBookingType) {
        return this.bookingService.returnBooking(returnDto);
    }

    @Mutation(() => BookingModel)
    async extendedBooking(@Args('extendDto') extendDto: ExtendedBookingType) {
        return this.bookingService.extendedBooking(extendDto);
    }

    @Query(() => [BookingModel])
    async paginationBooking(
        @Args('paginationDto') paginationDto: PaginationBookingType,
    ) {
        return this.bookingService.paginationBooking(paginationDto);
    }

    @Query(() => [BookingModel])
    async searchForBookings(
        @Args('keyword', { type: () => String }) keyword: string,
    ) {
        return this.bookingService.searchForBookings(keyword);
    }
}
