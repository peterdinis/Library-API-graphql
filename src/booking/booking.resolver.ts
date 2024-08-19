import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BookingService } from './booking.service';
import { CreateBookingType } from './dto/create-booking-dto';
import { ReturnBookingType } from './dto/return-booking-dto';
import { ExtendedBookingType } from './dto/extended-booking-dto';
import { BookingModel } from './booking.model';

@Resolver(() => BookingModel)
export class BookingResolver {
    constructor(private readonly bookingService: BookingService) {}

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

    @Mutation(() => BookingModel)
    async returnBooking(@Args('returnDto') returnDto: ReturnBookingType) {
        return this.bookingService.returnBooking(returnDto);
    }

    @Mutation(() => BookingModel)
    async extendedBooking(@Args('extendDto') extendDto: ExtendedBookingType) {
        return this.bookingService.extendedBooking(extendDto);
    }
}