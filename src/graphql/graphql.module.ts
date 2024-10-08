import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            sortSchema: true,
            buildSchemaOptions: {
                dateScalarMode: 'isoDate',
            },
            installSubscriptionHandlers: true,
            debug: true,
            playground: true,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        }),
    ],
})
export class AppGraphqlModule {}
