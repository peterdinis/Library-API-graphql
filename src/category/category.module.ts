import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { PubSub } from 'graphql-subscriptions';

@Module({
    imports: [PrismaModule],
    providers: [CategoryService, CategoryResolver, {
        provide: 'PUB_SUB',
        useValue: new PubSub(),
    }],
    exports: [CategoryService],
})
export class CategoryModule {}
