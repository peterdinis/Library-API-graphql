import { Field, InputType, Int } from '@nestjs/graphql';
import { DateTimeScalar } from 'src/utils/DateScalar';
import {
  IsString,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsBoolean,
  IsDateString,
} from 'class-validator';

@InputType()
export class CreateBookInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  image: string;

  @Field()
  @IsDate()
  @IsNotEmpty()
  @IsDateString()
  createdYear: string;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  pages: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  authorName: string;

  @Field(() => Boolean)
  @IsBoolean()
  isAvaiable: boolean;

  @Field(() => Boolean)
  @IsBoolean()
  isBorrowed: boolean;

  @Field(() => Boolean)
  @IsBoolean()
  isReturned: boolean;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  stockNumber: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  serialNumber: string;

  @Field(() => Int)
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  authorId: number; 

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  categoryId: number;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  publisherId: number;

  @Field()
  @IsDateString()
  @IsNotEmpty()
  createdAt: string;

  @Field()
  @IsDateString()
  @IsNotEmpty()
  updatedAt: string;
}
