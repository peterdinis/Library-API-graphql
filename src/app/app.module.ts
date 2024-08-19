import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BookModule } from 'src/book/book.module';
import { CategoryModule } from 'src/category/category.module';
import { AppGraphqlModule } from 'src/graphql/graphql.module';
import { AuthorsModule } from '../authors/authors.module';
import { PublisherModule } from 'src/publisher/publisher.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { BookingModule } from 'src/booking/booking.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        PrismaModule,
        BookModule,
        CategoryModule,
        AppGraphqlModule,
        AuthorsModule,
        PublisherModule,
        AuthModule,
        BookingModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
