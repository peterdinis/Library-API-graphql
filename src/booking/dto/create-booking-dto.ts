import { Field, InputType } from '@nestjs/graphql';
import {
    IsString,
    IsNotEmpty,
    IsDate,
    IsDateString,
    IsBoolean,
    IsNumber,
    IsPositive,
    IsOptional,
} from 'class-validator';

@InputType()
export class CreateBookingType {
    @Field()
    @IsString()
    @IsNotEmpty()
    bookName: string;

    @Field()
    @IsDate()
    @IsDateString()
    @IsNotEmpty()
    from: string;

    @Field()
    @IsDate()
    @IsDateString()
    @IsNotEmpty()
    to: string;

    @Field()
    @IsBoolean()
    isExtended: boolean;

    @Field()
    @IsBoolean()
    isReturned: boolean;

    @Field()
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    userId: number;

    @Field()
    @IsDate()
    @IsDateString()
    @IsOptional()
    returnedDate: string;

    @Field()
    @IsDate()
    @IsDateString()
    @IsOptional()
    extendedDate: string;
}
