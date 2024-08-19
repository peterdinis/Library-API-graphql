import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Book } from '@prisma/client';
import { BookModel } from 'src/book/book.model';
import { DateTimeScalar } from 'src/utils/DateScalar';

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
  createdYear: string;

  @Field()
  deletedYear?: string;
}
