import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BookService } from './book.service';
import { BookResolver } from './book.resolver';

@Module({
    imports: [PrismaModule],
    providers: [BookService, BookResolver],
    exports: [BookService]
})
export class BookModule {}
