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

    @Field(() => Int)
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    stockNumber: number;

    @Field()
    @IsString()
    @IsNotEmpty()
    serialNumber: string;
}
