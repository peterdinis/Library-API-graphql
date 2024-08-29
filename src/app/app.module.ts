import { HealthModule } from './../health/health.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BookModule } from 'src/book/book.module';
import { CategoryModule } from 'src/category/category.module';
import { AppGraphqlModule } from 'src/graphql/graphql.module';
import { AuthorsModule } from '../authors/authors.module';
import { PublisherModule } from 'src/publisher/publisher.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { BookingModule } from 'src/booking/booking.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
        }),
        PrismaModule,
        BookModule,
        CategoryModule,
        HealthModule,
        AppGraphqlModule,
        AuthorsModule,
        PublisherModule,
        AuthModule,
        BookingModule,
    ],
    providers: [
        AppService,
    ],
    controllers: [AppController],
})
export class AppModule {}
