import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BookModule } from 'src/book/book.module';
import { CategoryModule } from 'src/category/category.module';
import { AppGraphqlModule } from 'src/graphql/graphql.module';
import { AuthorsModule } from '../authors/authors.module';

@Module({
  imports: [
    PrismaModule,
    BookModule,
    CategoryModule,
    AppGraphqlModule,
    AuthorsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
