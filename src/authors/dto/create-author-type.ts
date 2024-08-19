import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsDate, IsDateString } from 'class-validator';
import { DateTimeScalar } from 'src/utils/DateScalar';

@InputType()
export class CreateAuthorInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field()
  @IsDate()
  @IsNotEmpty()
  @IsDateString()
  litPeriod: Date;

  @Field()
  @IsDate()
  @IsNotEmpty()
  @IsDateString()
  birthYear: Date;

  @Field()
  @IsDate()
  @IsNotEmpty()
  @IsDateString()
  deathYear?: Date;
}
