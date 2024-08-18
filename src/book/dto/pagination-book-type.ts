import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

@InputType()
export class PaginationBookType {
  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  skip: number;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  take: number;
}
