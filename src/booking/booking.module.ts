import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BookingService } from './booking.service';
import { BookingResolver } from './booking.resolver';
import { BookModule } from 'src/book/book.module';
import { PubSub } from 'graphql-subscriptions';

@Module({
    imports: [PrismaModule, AuthModule, BookModule],
    providers: [BookingService, BookingResolver, {
        provide: "PUB_SUB",
        useValue: new PubSub()
    }],
    exports: [BookingService, 'PUB_SUB'],
})
export class BookingModule {}
