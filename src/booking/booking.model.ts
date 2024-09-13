import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BookingModel {
    @Field(() => Int)
    id: number;

    @Field()
    bookName: string;

    @Field()
    from: Date;

    @Field()
    to: Date;

    @Field(() => Boolean)
    isExtended: boolean;

    @Field(() => Boolean)
    isReturned: boolean;

    @Field(() => Int)
    userId: number;

    @Field()
    returnedDate: Date;

    @Field()
    extendedDate: Date;
}
