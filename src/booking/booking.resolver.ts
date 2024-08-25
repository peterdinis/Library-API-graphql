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
        @Inject('PUB_SUB') private readonly pubSub: PubSub
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
        const newBooking = await this.bookingService.createNewBooking(bookingDto);
        await this.pubSub.publish('bookingCreated', { bookingCreated: newBooking });
        return newBooking;
    }

    @Subscription(() => BookingModel, {
        resolve: (value) => {
            const booking = value.bookingCreated;
            return {
                ...booking,
                message: `A new booking for the book "${booking.bookName}" was created by user ID ${booking.userId}.`
            };
        },
    })
    bookingCreated() {
        return this.pubSub.asyncIterator('bookingCreated');
    }

    @Mutation(() => BookingModel)
    async returnBooking(@Args('returnDto') returnDto: ReturnBookingType) {
        const returnedBooking = await this.bookingService.returnBooking(returnDto);
        await this.pubSub.publish('bookingReturned', { bookingReturned: returnedBooking });
        return returnedBooking;
    }

    @Subscription(() => BookingModel, {
        resolve: (value) => {
            const booking = value.bookingReturned;
            return {
                ...booking,
                message: `The booking for the book "${booking.bookName}" by user ID ${booking.userId} has been returned.`
            };
        },
    })
    bookingReturned() {
        return this.pubSub.asyncIterator('bookingReturned');
    }

    @Mutation(() => BookingModel)
    async extendedBooking(@Args('extendDto') extendDto: ExtendedBookingType) {
        const extendedBooking = await this.bookingService.extendedBooking(extendDto);
        await this.pubSub.publish('bookingExtended', { bookingExtended: extendedBooking });
        return extendedBooking;
    }

    @Subscription(() => BookingModel, {
        resolve: (value) => {
            const booking = value.bookingExtended;
            return {
                ...booking,
                message: `The booking for the book "${booking.bookName}" by user ID ${booking.userId} has been extended until ${booking.extendedDate}.`
            };
        },
    })
    bookingExtended() {
        return this.pubSub.asyncIterator('bookingExtended');
    }

    @Query(() => [BookingModel])
    async paginationBooking(@Args('paginationDto') paginationDto: PaginationBookingType) {
        return this.bookingService.paginationBooking(paginationDto);
    }

    @Query(() => [BookingModel])
    async searchForBookings(@Args('keyword', { type: () => String }) keyword: string) {
        return this.bookingService.searchForBookings(keyword);
    }
}