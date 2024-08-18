import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsDate } from 'class-validator';

@InputType()
export class CreatePublisherInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsString()
  image: string;

  @Field()
  @IsDate()
  createdYear: Date;
}
