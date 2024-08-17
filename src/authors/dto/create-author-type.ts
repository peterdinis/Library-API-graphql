import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAuthorInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => Date, { nullable: true })
  litPeriod: Date;

  @Field(() => Date, { nullable: true })
  birthYear: Date;

  @Field(() => Date, { nullable: true })
  deathYear?: Date;
}