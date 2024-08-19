import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DateTimeScalar } from 'src/utils/DateScalar';

@ObjectType()
export class BookingModel {
    @Field(() => Int)
    id: number;

    @Field()
    bookName: string;

    @Field(() => DateTimeScalar)
    from: Date;

    @Field(() => DateTimeScalar)
    to: Date;

    @Field(() => Boolean)
    isExtended: Boolean;

    @Field(() => Boolean)
    isReturned: Boolean;

    @Field(() => Int)
    userId: number;

    @Field(() => DateTimeScalar)
    returnedDate: Date;

    @Field(() => DateTimeScalar)
    extendedDate: Date;
}
