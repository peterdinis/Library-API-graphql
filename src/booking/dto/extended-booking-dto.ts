import { Field, InputType, Int } from '@nestjs/graphql';
import {
    IsBoolean,
    IsDate,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsPositive,
} from 'class-validator';

@InputType()
export class ExtendedBookingType {
    @Field(() => Int)
    @IsNumber()
    @IsPositive()
    id: number;

    @Field()
    @IsBoolean()
    isExtended: boolean;

    @Field()
    @IsDate()
    @IsDateString()
    @IsNotEmpty()
    extendedDate: string;
}
