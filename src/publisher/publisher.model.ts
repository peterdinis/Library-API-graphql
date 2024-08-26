import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Book } from '@prisma/client';
import { BookModel } from 'src/book/book.model';

@ObjectType()
export class PublisherModel {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field()
    description: string;

    @Field()
    image: string;

    @Field(() => BookModel)
    books: Book[];

    @Field()
    createdYear: Date;

    @Field()
    deletedYear?: Date;
}
