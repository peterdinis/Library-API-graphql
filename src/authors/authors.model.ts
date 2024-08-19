import { ObjectType, Field, Int } from '@nestjs/graphql';
import { DateTimeScalar } from 'src/utils/DateScalar'; // Adjust path as necessary
import { BookModel } from 'src/book/book.model';

@ObjectType()
export class AuthorModel {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => DateTimeScalar, { nullable: true })
  litPeriod?: Date;

  @Field(() => DateTimeScalar)
  birthYear: Date;

  @Field(() => DateTimeScalar, { nullable: true })
  deathYear?: Date;

  @Field(() => [BookModel])
  books: BookModel[];

  @Field(() => DateTimeScalar)
  createdAt: Date;

  @Field(() => DateTimeScalar)
  updatedAt: Date;
}