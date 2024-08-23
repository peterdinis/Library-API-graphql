import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminService } from './admin.service';
import { BookModule } from 'src/book/book.module';
import { CategoryModule } from 'src/category/category.module';
import { PublisherModule } from 'src/publisher/publisher.module';
import { AuthorsModule } from 'src/authors/authors.module';
import { BookingModule } from 'src/booking/booking.module';

@Module({
    imports: [
        PrismaModule,
        BookModule,
        CategoryModule,
        PublisherModule,
        AuthorsModule,
        BookingModule,
    ],
    providers: [AdminService],
})
export class AdminModule {}
