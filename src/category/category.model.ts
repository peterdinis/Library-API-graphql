import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CategoryModel {
  @Field(() => Number)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;
}
