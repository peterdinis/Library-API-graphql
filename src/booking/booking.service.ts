import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookingService {
    constructor(private readonly prismaService: PrismaService) {}

    async getAllBookings() {
        const allBookings = await this.prismaService.booking.findMany();
        if(!allBookings) {
            throw new NotFoundException("No bookings found");
        }

        return allBookings;
    }

    async getOneBooking(id: number) {
        const oneBooking = await this.prismaService.booking.findUnique({
            where: {
                id
            }
        });

        if(!oneBooking) {
            throw new NotFoundException("No booking with this id" + id + "exists");
        }

        return oneBooking;
    }
}
