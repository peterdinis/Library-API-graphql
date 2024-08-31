import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Book } from '@prisma/client';
import { BookModel } from 'src/book/book.model';

@ObjectType()
export class CategoryModel {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field()
    description: string;

    @Field(() => BookModel, { nullable: true })
    books: Book[];
}
