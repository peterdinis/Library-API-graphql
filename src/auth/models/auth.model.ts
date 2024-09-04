import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
    @Field(() => Int)
    id: number;

    @Field()
    name: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    role: string;
}
