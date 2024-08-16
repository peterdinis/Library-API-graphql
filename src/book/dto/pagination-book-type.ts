import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PaginationBookType {
  @Field(() => Int)
  skip: number;

  @Field(() => Int)
  take: number;
}
