import { Field, InputType, Int } from '@nestjs/graphql';
import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsDateString,
} from 'class-validator';

@InputType()
export class UpdateBookInput {
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
    createdYear: string;

    @Field(() => Int)
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    pages: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    authorName: string;

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
