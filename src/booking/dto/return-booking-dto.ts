import { Field, InputType, Int } from '@nestjs/graphql';
import {
    IsBoolean,
    IsDate,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
} from 'class-validator';

@InputType()
export class ReturnBookingType {
    @Field(() => Int)
    @IsNumber()
    @IsPositive()
    id: number;

    @Field()
    @IsBoolean()
    isReturned: boolean;

    @Field()
    @IsDate()
    @IsDateString()
    @IsNotEmpty()
    returnedDate: string
}
