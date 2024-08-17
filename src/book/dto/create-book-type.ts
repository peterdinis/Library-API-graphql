import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateBookInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  image: string;

  @Field(() => Date)
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

  @Field()
  categoryId: number;
}
