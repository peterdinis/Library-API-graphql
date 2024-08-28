import { DateScalar } from './../scalars/DateScalar';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BookService } from './book.service';
import { BookResolver } from './book.resolver';
import { PubSub } from 'graphql-subscriptions';

@Module({
    imports: [PrismaModule],
    providers: [
        BookService,
        DateScalar,
        BookResolver,
        {
            provide: 'PUB_SUB',
            useValue: new PubSub(),
        },
    ],
    exports: [BookService],
})
export class BookModule {}
