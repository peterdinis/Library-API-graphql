import { ObjectType, Field, Int } from '@nestjs/graphql';
import { BookModel } from 'src/book/book.model';
import { DateTimeScalar } from 'src/utils/DateScalar';

@ObjectType()
export class AuthorModel {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  litPeriod: string;

  @Field()
  birthYear: string;

  @Field()
  deathYear?: string;

  @Field(() => [BookModel])
  books: BookModel[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
