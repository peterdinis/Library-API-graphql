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

  @Field(() => Date)
  litPeriod: Date;

  @Field(() => Date)
  birthYear: Date;

  @Field(() => Date, { nullable: true })
  deathYear?: Date;

  @Field(() => [BookModel])
  books: BookModel[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
