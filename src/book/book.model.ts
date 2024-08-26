import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AuthorModel } from 'src/authors/authors.model';
import { CategoryModel } from 'src/category/category.model';
import { PublisherModel } from 'src/publisher/publisher.model';

@ObjectType()
export class BookModel {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field()
    description: string;

    @Field()
    image: string;

    @Field()
    createdYear: string;

    @Field(() => Int)
    pages: number;

    @Field()
    authorName: string;

    @Field(() => Boolean)
    isAvaiable: boolean;

    @Field(() => Boolean)
    isBorrowed: boolean;

    @Field(() => Boolean)
    isReturned: boolean;

    @Field(() => Int)
    stockNumber: number;

    @Field()
    serialNumber: string;

    @Field(() => CategoryModel, { nullable: true })
    category?: CategoryModel;

    @Field(() => AuthorModel, { nullable: true })
    author?: AuthorModel;

    @Field(() => PublisherModel, { nullable: true })
    publisher?: PublisherModel;
}