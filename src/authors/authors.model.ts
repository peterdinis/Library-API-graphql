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

  @Field(() => DateTimeScalar)
  litPeriod: Date;

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
