import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { BookModule } from 'src/book/book.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { BookingModule } from 'src/booking/booking.module';
import { AdminResolver } from './admin.resolver';

@Module({
    imports: [
        PrismaModule,
        BookModule,
        AuthModule,
        BookingModule
    ],
    providers: [AdminService, AdminResolver],
})
export class AdminModule {}
