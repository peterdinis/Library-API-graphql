import { Field, InputType, Int } from '@nestjs/graphql';
import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsBoolean,
    IsDateString,
} from 'class-validator';

@InputType()
export class CreateBookInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    description: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    image: string;

    @Field()
    @IsDateString({ strict: true })
    @IsNotEmpty()
    createdYear: string;  // Change to string to correctly handle date parsing

    @Field(() => Int)
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    pages: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    authorName: string;

    @Field(() => Boolean)
    @IsBoolean()
    isAvailable: boolean;  // Fixed typo in the field name

    @Field(() => Boolean)
    @IsBoolean()
    isBorrowed: boolean;

    @Field(() => Boolean)
    @IsBoolean()
    isReturned: boolean;

    @Field(() => Int)
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    stockNumber: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    serialNumber: string;

    @Field(() => Int)
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    authorId: number;

    @Field(() => Int)
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    categoryId: number;

    @Field(() => Int)
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    publisherId: number;
}