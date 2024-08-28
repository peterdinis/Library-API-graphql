import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthorsService } from './authors.service';
import { AuthorsResolver } from './authors.resolver';
import { PubSub } from 'graphql-subscriptions';

@Module({
    imports: [PrismaModule],
    providers: [AuthorsService, AuthorsResolver, {
        provide: 'PUB_SUB',
        useValue: new PubSub(),
    },],
    exports: [AuthorsService],
})
export class AuthorsModule {}
