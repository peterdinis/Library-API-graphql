import { Field, InputType } from '@nestjs/graphql';
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
export class CreateCategoryInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => DateTimeScalar)
  @IsDate()
  @IsNotEmpty()
  @IsDateString()
  createdAt: Date;

  @Field(() => DateTimeScalar)
  @IsDate()
  @IsNotEmpty()
  @IsDateString()
  updatedAt: Date;
}
