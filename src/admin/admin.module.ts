import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { BookModule } from 'src/book/book.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        PrismaModule,
        BookModule,
        AuthModule
    ],
    providers: [AdminService],
})
export class AdminModule {}
