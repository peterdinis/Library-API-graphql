import { Field, InputType } from '@nestjs/graphql';
import { DateTimeScalar } from 'src/utils/DateScalar';

@InputType()
export class CreateCategoryInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => DateTimeScalar)
  createdAt: Date;

  @Field(() => DateTimeScalar)
  updatedAt: Date;
}
