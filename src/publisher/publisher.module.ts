import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PublisherService } from './publisher.service';
import { PublisherResolver } from './publisher.resolver';
import { PubSub } from 'graphql-subscriptions';

@Module({
    imports: [PrismaModule],
    providers: [
        PublisherService,
        PublisherResolver,
        {
            provide: 'PUB_SUB',
            useValue: new PubSub(),
        },
    ],
    exports: [PublisherService],
})
export class PublisherModule {}
