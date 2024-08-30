import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BookModel } from 'src/book/book.model';

@ObjectType()
export class AuthorModel {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field()
    litPeriod: Date;

    @Field()
    authorImage: string;

    @Field()
    birthYear: Date;

    @Field()
    deathYear?: Date

    @Field(() => [BookModel])
    books: BookModel[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
