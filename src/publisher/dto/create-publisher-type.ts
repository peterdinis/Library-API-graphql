import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsDate, IsNotEmpty, IsDateString } from 'class-validator';
import { DateTimeScalar } from 'src/utils/DateScalar';

@InputType()
export class CreatePublisherInput {
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

  @Field(() => DateTimeScalar)
  @IsDate()
  @IsNotEmpty()
  @IsDateString()
  createdYear: Date;
}
