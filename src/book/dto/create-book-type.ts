import { Field, InputType, Int } from '@nestjs/graphql';
import { DateTimeScalar } from 'src/utils/DateScalar';

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

  @Field(() => Int)
  categoryId: number;

  @Field(() => Int)
  publisherId: number;

  @Field(() => DateTimeScalar)
  createdAt: Date;

  @Field(() => DateTimeScalar)
  updatedAt: Date;
}
