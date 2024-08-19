import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PublisherService } from './publisher.service';
import { PublisherResolver } from './publisher.resolver';

@Module({
    imports: [PrismaModule],
    providers: [PublisherService, PublisherResolver]
})
export class PublisherModule {}
