import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { BookService } from 'src/book/book.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingType } from './dto/create-booking-dto';
import { ReturnBookingType } from './dto/return-booking-dto';
import { ExtendedBookingType } from './dto/extended-booking-dto';
import { PaginationBookingType } from './dto/pagination-booking-dto';
import { formatISO, parse, isValid } from 'date-fns';

@Injectable()
export class BookingService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly authService: AuthService,
        private readonly bookService: BookService,
    ) {}

    async paginationBooking(paginationDto: PaginationBookingType) {
        const allBookingsInApp = await this.prismaService.booking.findMany({
            skip: paginationDto.skip,
            take: paginationDto.take,
        });

        if (!allBookingsInApp || allBookingsInApp.length === 0) {
            throw new NotFoundException('No books found');
        }

        return allBookingsInApp;
    }

    async getAllBookings() {
        const allBookings = await this.prismaService.booking.findMany();
        if (!allBookings) {
            throw new NotFoundException('No bookings found');
        }

        return allBookings;
    }

    async searchForBookings(keyword: string) {
        const foundBookings = await this.prismaService.booking.findMany({
            where: {
                OR: [{ bookName: { contains: keyword, mode: 'insensitive' } }],
            },
        });

        if (!foundBookings || foundBookings.length === 0) {
            throw new NotFoundException(
                `No books found for keyword "${keyword}"`,
            );
        }

        return foundBookings;
    }

    async getOneBooking(id: number) {
        const oneBooking = await this.prismaService.booking.findUnique({
            where: {
                id,
            },
        });

        if (!oneBooking) {
            throw new NotFoundException(
                'No booking with this id' + id + 'exists',
            );
        }

        return oneBooking;
    }

    async createNewBooking(bookingDto: CreateBookingType) {
        // Validate the date formats
        this.validateDateFormat(bookingDto.from);
        this.validateDateFormat(bookingDto.to);

        const findOneUser = await this.authService.findOneUserById(
            bookingDto.userId,
        );
        const findOneBook = await this.bookService.findOneBookByName(
            bookingDto.bookName,
        );

        const createBooking = await this.prismaService.booking.create({
            data: {
                ...bookingDto,
                bookName: findOneBook.name,
                userId: findOneUser.id,
            },
        });

        if (!createBooking) {
            throw new BadRequestException('Create booking failed');
        }

        return createBooking;
    }

    async returnBooking(returnDto: ReturnBookingType) {
        // Validate the returnedDate format
        if (returnDto.returnedDate) {
            this.validateDateFormat(returnDto.returnedDate);
        }

        const booking = await this.prismaService.booking.findUnique({
            where: { id: returnDto.id },
        });

        if (!booking) {
            throw new NotFoundException(
                `Booking with id ${returnDto.id} not found`,
            );
        }

        if (booking.isReturned) {
            throw new BadRequestException(
                `Booking with id ${returnDto.id} has already been returned`,
            );
        }

        const updatedBooking = await this.prismaService.booking.update({
            where: { id: returnDto.id },
            data: {
                isReturned: returnDto.isReturned,
                returnedDate: returnDto.returnedDate
                    ? parse(returnDto.returnedDate, 'yyyy-MM-dd', new Date())
                    : null,
                updatedAt: formatISO(new Date()),
            },
        });

        return updatedBooking;
    }

    async extendedBooking(extendDto: ExtendedBookingType) {
        // Validate the extendedDate format
        if (extendDto.extendedDate) {
            this.validateDateFormat(extendDto.extendedDate);
        }

        const booking = await this.prismaService.booking.findUnique({
            where: { id: extendDto.id },
        });

        if (!booking) {
            throw new NotFoundException(
                `Booking with id ${extendDto.id} not found`,
            );
        }

        if (booking.isExtended) {
            throw new BadRequestException(
                `Booking with id ${extendDto.id} has already been extended`,
            );
        }

        const updatedBooking = await this.prismaService.booking.update({
            where: { id: extendDto.id },
            data: {
                isExtended: extendDto.isExtended,
                extendedDate: extendDto.extendedDate
                    ? parse(extendDto.extendedDate, 'yyyy-MM-dd', new Date())
                    : null,
                updatedAt: formatISO(new Date()),
            },
        });

        return updatedBooking;
    }

    private validateDateFormat(dateString: string) {
        const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());

        if (!isValid(parsedDate)) {
            throw new BadRequestException(
                `Invalid date format for ${dateString}. Expected format is yyyy-MM-dd.`,
            );
        }
    }
}
