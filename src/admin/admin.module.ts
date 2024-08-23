import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminService } from './admin.service';

@Module({
    imports: [PrismaModule],
    providers: [AdminService],
})
export class AdminModule {}
