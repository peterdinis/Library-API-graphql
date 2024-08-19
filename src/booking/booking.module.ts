import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BookingService } from './booking.service';
import { BookingResolver } from './booking.resolver';

@Module({
    imports: [PrismaModule, AuthModule],
    providers: [BookingService, BookingResolver],
})
export class BookingModule {}
